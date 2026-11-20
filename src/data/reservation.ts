// Shared by the reserve action (server) and the form script (browser): no server-only imports here.
import { z } from 'astro/zod';
import type { OpeningHours } from './hours';

export const MAX_GUESTS = 8;
/** Bookable days, today included. */
export const BOOKING_DAYS = 14;
export const SLOT_MINUTES = 30;

/** Today's date and current time in Vienna as "YYYY-MM-DD" / "HH:MM", independent of the server's UTC clock. */
export function viennaNow(now = new Date()) {
  // sv-SE formats as "2026-11-17 14:05", which splits cleanly into ISO date and time.
  const [date, time] = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Vienna',
    dateStyle: 'short',
    timeStyle: 'short',
  })
    .format(now)
    .split(' ');
  return { date, time };
}

/** "YYYY-MM-DD" plus n days; noon UTC keeps DST changes from shifting the day. */
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "2026-11-20" -> "Freitag, 20. November 2026" */
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('de-AT', { dateStyle: 'full', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));

/** "08:00" -> "8:00" for display. */
export const formatTime = (time: string) => time.replace(/^0/, '');

/** "19:00" -> "18:00": the last table we take is one hour before closing. */
export const lastBooking = (close: string) => `${String(Number(close.slice(0, 2)) - 1).padStart(2, '0')}${close.slice(2)}`;

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** "HH:MM" every SLOT_MINUTES from `from` to `to`, both included. */
function slotRange(from: string, to: string) {
  const slots: string[] = [];
  for (let m = toMinutes(from); m <= toMinutes(to); m += SLOT_MINUTES) slots.push(toTime(m));
  return slots;
}

// Booking rules below take the opening hours as an argument: the server reads them from the content
// collection, the browser gets the same rows from the form's data-hours attribute.

const hoursOn = (hours: OpeningHours[], date: string) =>
  hours.find((h) => h.days.includes(new Date(`${date}T12:00:00Z`).getUTCDay()));

/** Every slot of the week, from the earliest opening to the latest last table. */
export function allSlots(hours: OpeningHours[]) {
  const open = hours.flatMap((h) => (h.open && h.close ? [h] : []));
  const first = open.map((h) => h.open!).sort()[0];
  const last = open.map((h) => lastBooking(h.close!)).sort().at(-1);
  return first && last ? slotRange(first, last) : [];
}

/** Bookable slots on one date; on today only those still ahead. */
export function slotsFor(hours: OpeningHours[], date: string, now = viennaNow()) {
  const day = hoursOn(hours, date);
  if (!day?.open || !day.close) return [];
  return slotRange(day.open, lastBooking(day.close)).filter((t) => date !== now.date || t > now.time);
}

/** The bookable window; a day is closed on a Ruhetag, or today once no slot is left. */
export const bookingDays = (hours: OpeningHours[], now = viennaNow()) =>
  Array.from({ length: BOOKING_DAYS }, (_, i) => {
    const date = addDays(now.date, i);
    return { date, closed: slotsFor(hours, date, now).length === 0 };
  });

export const SLOT_GROUPS = ['Frühstück', 'Mittag', 'Nachmittag'] as const;
/** Breakfast up to 10:30, lunch 11:00–13:30, afternoon from 14:00. */
export const slotGroup = (time: string): (typeof SLOT_GROUPS)[number] =>
  time <= '10:30' ? 'Frühstück' : time < '14:00' ? 'Mittag' : 'Nachmittag';

/** The one place that decides whether date and time can be booked; null when they can. */
export function checkBooking(hours: OpeningHours[], date: string, time: string, now = viennaNow()) {
  const fail = (path: 'date' | 'time', message: string) => ({ path, message });
  if (date < now.date) return fail('date', 'Das Datum liegt in der Vergangenheit.');
  if (date > addDays(now.date, BOOKING_DAYS - 1)) {
    return fail('date', `Reservierungen sind höchstens ${BOOKING_DAYS} Tage im Voraus möglich.`);
  }
  const day = hoursOn(hours, date);
  if (!day?.open || !day.close) return fail('date', `${day?.label ?? 'An diesem Tag'} ist Ruhetag. Bitte wählen Sie einen anderen Tag.`);
  const slots = slotsFor(hours, date, now);
  if (slots.length === 0) return fail('date', 'Für heute nehmen wir keine Reservierungen mehr an.');
  if (slots.includes(time)) return null;
  if (date === now.date && time <= now.time) return fail('time', 'Diese Uhrzeit ist heute schon vorbei.');
  return fail(
    'time',
    `Bitte wählen Sie eine Uhrzeit zwischen ${formatTime(day.open)} und ${formatTime(lastBooking(day.close))} Uhr im ${SLOT_MINUTES}-Minuten-Takt.`,
  );
}

// Astro's form parsing turns an empty field into null, so optional text accepts that and normalises to ''.
const optionalText = z.string().trim().nullish().transform((v) => v ?? '');

export const reservationSchema = z
  .object({
    name: z
      .string('Bitte geben Sie Ihren Namen an.')
      .trim()
      .min(2, 'Bitte geben Sie Ihren Namen an.')
      .max(80, 'Der Name darf höchstens 80 Zeichen lang sein.')
      // A single line keeps the mail subject clean.
      .regex(/^[^\r\n]*$/, 'Der Name darf keine Zeilenumbrüche enthalten.'),
    email: z
      .string('Bitte geben Sie Ihre E-Mail-Adresse an.')
      .trim()
      .max(120, 'Die E-Mail-Adresse ist zu lang.')
      .pipe(z.email('Bitte geben Sie eine gültige E-Mail-Adresse an, z. B. name@beispiel.at.')),
    phone: z
      .string('Bitte geben Sie Ihre Telefonnummer an.')
      .trim()
      .regex(/^\+?[\d\s/()-]{6,20}$/, 'Bitte geben Sie eine Telefonnummer mit mindestens 6 Ziffern an.'),
    // Format only: range, Ruhetag and slot are checked by checkBooking, which needs the opening hours.
    date: z.string('Bitte wählen Sie ein Datum.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte wählen Sie ein Datum.'),
    time: z.string('Bitte wählen Sie eine Uhrzeit.').regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Bitte wählen Sie eine Uhrzeit.'),
    guests: z.coerce
      .number('Bitte geben Sie die Anzahl der Personen an.')
      .int('Bitte geben Sie eine ganze Zahl an.')
      .min(1, 'Mindestens 1 Person.')
      .max(MAX_GUESTS, `Für Gruppen ab ${MAX_GUESTS + 1} Personen rufen Sie uns bitte an.`),
    note: optionalText.pipe(z.string().max(500, 'Die Anmerkung darf höchstens 500 Zeichen lang sein.')),
    // Spam traps: checked in the action, never shown as field errors.
    website: optionalText,
    startedAt: z.coerce.number(),
  });

export type Reservation = z.infer<typeof reservationSchema>;
