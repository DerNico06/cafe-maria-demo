import { defineAction, ActionError } from 'astro:actions';
import { RESEND_API_KEY, RESERVATION_FROM, RESERVATION_TO } from 'astro:env/server';
import { getOpeningHours, formatTime } from '../data/hours';
import { reservationSchema, formatDate, type Reservation } from '../data/reservation';
import { site } from '../data/site';

const MIN_FILL_MS = 3_000;
const LIMIT = 3;
const WINDOW_MS = 10 * 60_000;

// shortcut: per instance only, Vercel Firewall rule is the real limit (see README); use Redis if spam gets through.
const recent = new Map<string, number[]>();

/** IPv6 clients usually own a whole /64, so count the prefix instead of the single address. */
const clientKey = (ip: string) => (ip.includes(':') ? ip.split(':').slice(0, 4).join(':') : ip);

function isRateLimited(ip: string, now = Date.now()) {
  const key = clientKey(ip);
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) return true;
  recent.set(key, [...hits, now]);
  // Keep the map from growing without bound on a long-lived instance.
  if (recent.size > 5_000) recent.clear();
  return false;
}

/** "19:00" -> "18:00": the last table we take is one hour before closing. */
const hourBefore = (time: string) => `${String(Number(time.slice(0, 2)) - 1).padStart(2, '0')}${time.slice(2)}`;

// Server-only rule: opening hours live in a content collection, which the browser cannot read.
const input = reservationSchema.superRefine(async (r, ctx) => {
  const weekday = new Date(`${r.date}T12:00:00Z`).getUTCDay();
  const day = (await getOpeningHours()).find((h) => h.days.includes(weekday));
  if (!day?.open || !day.close) {
    ctx.addIssue({ code: 'custom', path: ['date'], message: `${day?.label ?? 'An diesem Tag'} ist Ruhetag. Bitte wählen Sie einen anderen Tag.` });
    return;
  }
  const last = hourBefore(day.close);
  if (r.time < day.open || r.time > last) {
    ctx.addIssue({
      code: 'custom',
      path: ['time'],
      message: `An diesem Tag nehmen wir Reservierungen von ${formatTime(day.open)} bis ${formatTime(last)} Uhr an.`,
    });
  }
});

const mailText = (r: Omit<Reservation, 'website' | 'startedAt'>) =>
  [
    'Neue Reservierungsanfrage über die Website (Demo):',
    '',
    `Name:      ${r.name}`,
    `E-Mail:    ${r.email}`,
    `Telefon:   ${r.phone}`,
    `Datum:     ${formatDate(r.date)}`,
    `Uhrzeit:   ${r.time} Uhr`,
    `Personen:  ${r.guests}`,
    `Anmerkung: ${r.note || '–'}`,
  ].join('\n');

export const server = {
  reserve: defineAction({
    accept: 'form',
    input,
    handler: async (r, context) => {
      const { website, startedAt, ...reservation } = r;

      // Bots get a normal-looking success so they learn nothing; no mail is sent.
      const tooFast = Date.now() - startedAt < MIN_FILL_MS;
      if (website !== '' || tooFast) return reservation;

      if (isRateLimited(context.clientAddress)) {
        throw new ActionError({
          code: 'TOO_MANY_REQUESTS',
          message: `Sie haben gerade schon mehrere Anfragen gesendet. Bitte versuchen Sie es später noch einmal oder rufen Sie uns an: ${site.phone.display}.`,
        });
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: RESERVATION_FROM,
          // Fixed recipient: the guest address is never a recipient, so the form cannot be abused to mail strangers.
          to: [RESERVATION_TO],
          reply_to: reservation.email,
          subject: `Reservierung: ${reservation.date} ${reservation.time}, ${reservation.guests} Pers.`,
          text: mailText(reservation),
        }),
      }).catch(() => null);

      if (!res?.ok) {
        // Status only: guest data must not end up in the logs.
        console.error(`Resend request failed: ${res?.status ?? 'network error'}`);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Ihre Reservierung konnte leider nicht gesendet werden. Bitte rufen Sie uns an: ${site.phone.display}.`,
        });
      }
      return reservation;
    },
  }),
};
