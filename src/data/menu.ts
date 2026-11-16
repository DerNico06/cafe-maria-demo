// Fixed vocabularies for the menu. The content schema and the menu page both read from here.

export const menuCategories = {
  fruehstueck: 'Frühstück',
  mittagstisch: 'Mittagstisch',
  mehlspeisen: 'Mehlspeisen',
  getraenke: 'Getränke',
} as const;

/** Austrian allergen codes (Allergeninformationsverordnung). I, J, K and Q are not used. */
export const allergens = {
  A: 'Glutenhaltiges Getreide',
  B: 'Krebstiere',
  C: 'Ei',
  D: 'Fisch',
  E: 'Erdnuss',
  F: 'Soja',
  G: 'Milch und Laktose',
  H: 'Schalenfrüchte (Nüsse)',
  L: 'Sellerie',
  M: 'Senf',
  N: 'Sesam',
  O: 'Sulfite',
  P: 'Lupinen',
  R: 'Weichtiere',
} as const;

export const menuTags = {
  vegetarisch: 'vegetarisch',
  vegan: 'vegan',
  glutenfrei: 'glutenfrei',
} as const;

export type MenuCategory = keyof typeof menuCategories;
export type AllergenCode = keyof typeof allergens;
export type MenuTag = keyof typeof menuTags;

/** Allergens that come from animals; a vegan dish must not contain them. */
export const animalAllergens: AllergenCode[] = ['B', 'C', 'D', 'G', 'R'];
