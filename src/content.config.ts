import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file } from 'astro/loaders';
import { menuCategories, allergens, menuTags, animalAllergens } from './data/menu';

const keys = <T extends object>(o: T) => Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const menu = defineCollection({
  // The store returns entries sorted by id, so remember each dish's position in the file.
  loader: file('src/content/menu.json', {
    parser: (text) => (JSON.parse(text) as object[]).map((entry, order) => ({ ...entry, order })),
  }),
  schema: z
    .object({
      id: z.string().regex(/^[a-z0-9-]+$/, 'id: nur Kleinbuchstaben, Ziffern und Bindestriche'),
      order: z.number().int(),
      category: z.enum(keys(menuCategories)),
      name: z.string().min(2),
      description: z.string().min(10),
      price: z.number().positive().max(100),
      allergens: z.array(z.enum(keys(allergens))),
      tags: z.array(z.enum(keys(menuTags))).default([]),
    })
    // Content rules: the build fails if a dish contradicts its own tags.
    .refine((d) => !d.tags.includes('vegan') || d.tags.includes('vegetarisch'), {
      message: 'vegan setzt vegetarisch voraus',
    })
    .refine((d) => !d.tags.includes('vegan') || !d.allergens.some((a) => animalAllergens.includes(a)), {
      message: 'vegan, aber tierisches Allergen (B, C, D, G oder R) angegeben',
    })
    .refine((d) => !d.tags.includes('glutenfrei') || !d.allergens.includes('A'), {
      message: 'glutenfrei, aber Allergen A angegeben',
    }),
});

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Uhrzeit im Format HH:MM');

const openingHours = defineCollection({
  loader: file('src/content/opening-hours.json'),
  schema: z
    .object({
      id: z.string(),
      label: z.string(),
      /** JS weekday numbering: 0 = Sunday … 6 = Saturday. */
      days: z.array(z.number().int().min(0).max(6)).min(1),
      /** null = Ruhetag */
      open: time.nullable(),
      close: time.nullable(),
    })
    .refine((h) => (h.open === null) === (h.close === null), {
      message: 'open und close müssen beide gesetzt oder beide null (Ruhetag) sein',
    })
    .refine((h) => h.open === null || h.close === null || h.open < h.close, {
      message: 'open muss vor close liegen',
    }),
});

export const collections = { menu, openingHours };
