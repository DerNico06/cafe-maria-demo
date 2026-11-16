// Single source for business data. Header, footer, contact page and schema.org read from here.

export const site = {
  name: 'Café Maria',
  slogan: 'Bleiben Sie, so lange Sie mögen.',
  description:
    'Wiener Kaffeehaus in Neubau: Frühstück ab acht, Mittagstisch unter der Woche, Mehlspeisen aus der eigenen Backstube.',
  address: {
    street: 'Melangegasse 12',
    zip: '1070',
    city: 'Wien',
  },
  // shortcut: fictional number in Vienna format, may belong to a real line; replace with a number you own before going live.
  phone: { display: '+43 1 234 56 78', href: 'tel:+4312345678' },
  // .example is a reserved TLD, so this address can never reach a real inbox.
  email: 'hallo@cafe-maria.example',
} as const;

/** Weekdays use JS numbering (0 = Sunday) so "open now" and schema.org can be derived later. */
export interface OpeningHours {
  label: string;
  days: number[];
  open: string | null;
  close: string | null;
}

export const openingHours: OpeningHours[] = [
  { label: 'Montag', days: [1], open: null, close: null },
  { label: 'Dienstag – Freitag', days: [2, 3, 4, 5], open: '08:00', close: '19:00' },
  { label: 'Samstag', days: [6], open: '09:00', close: '19:00' },
  { label: 'Sonntag & Feiertag', days: [0], open: '09:00', close: '17:00' },
];

export const lunchHours = { label: 'Mittagstisch', days: 'Di – Fr', time: '11:30 – 14:00' };

/** "08:00" -> "8:00" for display. */
export const formatTime = (time: string) => time.replace(/^0/, '');

export const formatHours = (h: OpeningHours) =>
  h.open && h.close ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Ruhetag';
