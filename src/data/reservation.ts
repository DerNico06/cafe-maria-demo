// Shared by the reserve action (server) and the form script (browser): no server-only imports here.
import { z } from 'astro/zod';

export const MAX_GUESTS = 8;
export const BOOKING_DAYS_AHEAD = 90;

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
    date: z
      .string('Bitte wählen Sie ein Datum.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Bitte wählen Sie ein Datum.')
      .refine((d) => d >= viennaNow().date, 'Das Datum liegt in der Vergangenheit.')
      .refine(
        (d) => d <= addDays(viennaNow().date, BOOKING_DAYS_AHEAD),
        `Reservierungen sind bis zu ${BOOKING_DAYS_AHEAD} Tage im Voraus möglich.`,
      ),
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
  })
  .refine((r) => r.date !== viennaNow().date || r.time > viennaNow().time, {
    message: 'Diese Uhrzeit ist heute schon vorbei.',
    path: ['time'],
  });

export type Reservation = z.infer<typeof reservationSchema>;
