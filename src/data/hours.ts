import { getCollection, type CollectionEntry } from 'astro:content';

export type OpeningHours = CollectionEntry<'openingHours'>['data'];

const mondayFirst = (day: number) => (day + 6) % 7;

/** All opening-hour rows, Monday first. Fails the build unless every weekday appears exactly once. */
export async function getOpeningHours(): Promise<OpeningHours[]> {
  const hours = (await getCollection('openingHours'))
    .map((e) => e.data)
    .sort((a, b) => mondayFirst(Math.min(...a.days)) - mondayFirst(Math.min(...b.days)));

  const days = hours.flatMap((h) => h.days).sort();
  if (days.join() !== '0,1,2,3,4,5,6') {
    throw new Error(`opening-hours.json: jeder Wochentag genau einmal erwartet, gefunden: [${days}]`);
  }
  return hours;
}

// Lives with the booking rules so the browser can use it without pulling in astro:content.
import { formatTime } from './reservation';
export { formatTime };

export const formatHours = (h: OpeningHours) =>
  h.open && h.close ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Ruhetag';
