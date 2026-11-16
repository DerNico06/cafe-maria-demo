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

// Opening hours live in src/content/opening-hours.json (read via src/data/hours.ts).
export const lunchHours = { label: 'Mittagstisch', days: 'Di – Fr', time: '11:30 – 14:00' };
