// StoryForge Datasets - Re-exports and generation logic
// Datasets are split into focused modules under src/lib/datasets/

export {
  characterNames,
  kingdomNames,
  cultivationRealms,
  magicAbilities,
  sectNames,
  monsterSpecies,
  personalityTraits,
  storyConflicts,
} from './datasets/index';

import {
  characterNames,
  kingdomNames,
  cultivationRealms,
  magicAbilities,
  sectNames,
  monsterSpecies,
  personalityTraits,
  storyConflicts,
} from './datasets/index';

// Track recently used items per category to ensure uniqueness
const recentlyUsed: Record<string, Set<number>> = {};
const MAX_HISTORY = 50; // Remember last 50 picks per category

function getHistory(category: string): Set<number> {
  if (!recentlyUsed[category]) {
    recentlyUsed[category] = new Set();
  }
  return recentlyUsed[category];
}

// Pick a unique random item, avoiding recently used indices
export function pickOne<T>(arr: T[], category?: string): T {
  if (!category) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const history = getHistory(category);
  
  // Reset history if we've used most of the array
  if (history.size >= arr.length * 0.7) {
    history.clear();
  }

  let idx: number;
  let attempts = 0;
  do {
    idx = Math.floor(Math.random() * arr.length);
    attempts++;
  } while (history.has(idx) && attempts < 20);

  history.add(idx);
  
  // Trim old entries if history gets too large
  if (history.size > MAX_HISTORY) {
    const entries = Array.from(history);
    for (let i = 0; i < entries.length - MAX_HISTORY; i++) {
      history.delete(entries[i]);
    }
  }

  return arr[idx];
}

// Pick N unique random items from an array
export function pickRandom<T>(arr: T[], count: number, category?: string): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  const history = category ? getHistory(category) : new Set<number>();

  // Reset if we can't pick enough unique items
  if (category && history.size >= arr.length * 0.7) {
    history.clear();
  }

  let attempts = 0;
  while (result.length < Math.min(count, arr.length) && attempts < 100) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx) && (!category || !history.has(idx))) {
      used.add(idx);
      if (category) history.add(idx);
      result.push(arr[idx]);
    }
    attempts++;
  }

  // Fallback: fill remaining with any unused
  if (result.length < count) {
    for (let i = 0; i < arr.length && result.length < count; i++) {
      if (!used.has(i)) {
        used.add(i);
        result.push(arr[i]);
      }
    }
  }

  return result;
}

// Dataset selections per generator type — uses tracked categories for uniqueness
export function getDatasetSelections(generatorType: string): Record<string, string> {
  switch (generatorType) {
    case "character":
      return {
        dataName: pickOne(characterNames, "charName"),
        dataTrait: pickOne(personalityTraits, "trait"),
        dataPower: pickOne(magicAbilities, "power"),
        dataRealm: pickOne(cultivationRealms, "realm"),
        dataConflict: pickOne(storyConflicts, "conflict"),
      };
    case "world":
      return {
        dataKingdom: pickOne(kingdomNames, "kingdom"),
        dataMonster: pickOne(monsterSpecies, "monster"),
        dataMagic: pickOne(magicAbilities, "power"),
        dataConflict: pickOne(storyConflicts, "conflict"),
      };
    case "cultivation":
      return {
        dataRealms: pickRandom(cultivationRealms, 5, "realm").join(", "),
      };
    case "villain":
      return {
        dataName: pickOne(characterNames, "charName"),
        dataTrait: pickOne(personalityTraits, "trait"),
        dataPower: pickOne(magicAbilities, "power"),
        dataSect: pickOne(sectNames, "sect"),
      };
    case "name":
      return {
        dataSamples: pickRandom(characterNames, 3, "charName").join(", "),
      };
    case "plot":
      return {
        dataConflict: pickOne(storyConflicts, "conflict"),
        dataKingdom: pickOne(kingdomNames, "kingdom"),
        dataMonster: pickOne(monsterSpecies, "monster"),
      };
    default:
      return {};
  }
}
