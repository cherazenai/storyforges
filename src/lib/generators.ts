// Random pick helper
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const firstNames = ["Kael", "Lyra", "Theron", "Seraphina", "Darius", "Elara", "Voss", "Mira", "Zephyr", "Nyx", "Orion", "Selene", "Riven", "Astrid", "Caden", "Isolde", "Fenris", "Yuki", "Alaric", "Freya"];
const lastNames = ["Draven", "Ashford", "Nighthollow", "Stormweaver", "Blackthorn", "Voidborn", "Frostbane", "Silverwind", "Ironhart", "Duskwalker", "Shadowmere", "Starfall", "Grimwood", "Moonveil", "Emberclaw"];
const roles = ["Fallen Prince", "Wandering Swordsman", "Exiled Mage", "Shadow Assassin", "Chosen One", "Reluctant Hero", "Dark Sorcerer", "Dragon Rider", "Spirit Medium", "Celestial Guardian", "War General", "Court Advisor"];
const personalities = ["Ruthless yet honorable", "Cold and calculating", "Warm-hearted but reckless", "Stoic and mysterious", "Charismatic and cunning", "Gentle but harboring darkness", "Fiercely loyal", "Quiet and observant", "Impulsive and brave", "Sarcastic but caring"];
const goals = ["Reclaim a destroyed kingdom", "Avenge a fallen mentor", "Unlock forbidden power", "Unite warring clans", "Destroy an ancient evil", "Find a lost artifact", "Protect the last bloodline", "Break an ancestral curse", "Ascend to godhood", "Restore balance to the realms"];
const secrets = ["Carries forbidden blood magic", "Is the reincarnation of an ancient deity", "Secretly serves the enemy", "Has a twin trapped in another realm", "Can hear the whispers of the dead", "Possesses the last dragon egg", "Is slowly losing their memories", "Made a pact with a void entity"];
const weaknesses = ["Haunted by guilt", "Cannot trust others", "Addicted to power", "Blind loyalty to the wrong people", "Fear of their own potential", "A terminal magical illness", "Emotional vulnerability they hide", "Memories of a past life"];

export function generateCharacter(roleInput?: string, personalityInput?: string, settingInput?: string) {
  const name = `${pick(firstNames)} ${pick(lastNames)}`;
  const role = roleInput || pick(roles);
  const personality = personalityInput || pick(personalities);
  const goal = pick(goals);
  const secret = pick(secrets);
  const weakness = pick(weaknesses);

  return {
    type: "character",
    result: {
      Name: name,
      Role: role,
      Setting: settingInput || "Dark Fantasy",
      Personality: personality,
      Goal: goal,
      Secret: secret,
      Weakness: weakness,
    },
  };
}

const nameStyles = ["Elven", "Draconic", "Celestial", "Demonic", "Nordic", "Eastern", "Ancient"];
const namePrefixes = ["Aer", "Thal", "Vor", "Zar", "Ky", "Mor", "Sel", "Xan", "Val", "Ith", "Ael", "Dra", "Fen", "Lun", "Sha"];
const nameSuffixes = ["ion", "ara", "ith", "eon", "is", "ax", "ael", "or", "yn", "us", "iel", "ova", "ren", "dal", "mir"];
const nameTitles = ["the Undying", "Shadowborn", "of the Void", "the Eternal", "Stormcaller", "Nightbringer", "the Luminous", "Worldbreaker"];

export function generateName(style?: string, type?: string) {
  const names = Array.from({ length: 5 }, () => {
    const name = `${pick(namePrefixes)}${pick(nameSuffixes)}`;
    return Math.random() > 0.5 ? `${name} ${pick(nameTitles)}` : name;
  });
  return {
    type: "name",
    result: {
      Style: style || pick(nameStyles),
      Type: type || "Character",
      "Generated Names": names.join("\n"),
    },
  };
}

const realmNames = ["Celestial Jade Heavens", "Abyssal Void Domain", "Eternal Frost Peak", "Divine Thunder Valley", "Primordial Chaos Realm", "Nine Heavens Immortal Court", "Starfall Spirit Domain"];
const powerSystems = ["Qi Cultivation — harness inner energy through meditation and combat", "Soul Refinement — strengthen the soul to unlock spiritual abilities", "Body Tempering — forge the physical body into an indestructible weapon", "Dao Comprehension — understand universal laws to reshape reality", "Blood Essence — draw power from ancestral bloodlines"];
const stages = ["Mortal → Qi Condensation → Foundation Building → Core Formation → Nascent Soul → Spirit Severing → Dao Seeking → Immortal Ascension", "Iron Body → Bronze Meridians → Silver Core → Gold Spirit → Diamond Soul → Celestial Transcendence"];

export function generateCultivation(genre?: string) {
  return {
    type: "cultivation",
    result: {
      "Realm Name": pick(realmNames),
      Genre: genre || "Xianxia",
      "Power System": pick(powerSystems),
      "Progression Stages": pick(stages),
      "Unique Rule": pick([
        "Cultivators who fail tribulation become wandering spirits",
        "Each realm has a guardian beast that must be defeated",
        "Time flows differently at each cultivation stage",
        "Breaking through requires sacrificing a memory",
        "Only those with dual-element affinity can reach Immortal rank",
      ]),
    },
  };
}

const twists = [
  "The mentor was the true villain all along, manipulating events from the shadows.",
  "The hero discovers they are a clone of the original chosen one, who died years ago.",
  "The magical artifact they sought was already inside them, sealed by their own ancestor.",
  "The war was orchestrated by a third kingdom that benefits from both sides' destruction.",
  "The love interest is an ancient being wearing a mortal disguise.",
  "The prophecy was mistranslated — it actually predicts the hero's downfall, not victory.",
  "The villain and hero share the same soul, split across two bodies.",
  "The 'safe haven' kingdom is actually a prison realm designed to trap heroes.",
];

export function generatePlotTwist(genre?: string) {
  return {
    type: "plot",
    result: {
      Genre: genre || "Fantasy",
      "Plot Twist": pick(twists),
      "Story Impact": pick([
        "Forces the protagonist to question everything they believed",
        "Shifts alliances dramatically",
        "Opens a new arc with higher stakes",
        "Creates moral ambiguity — no clear right choice",
        "Reveals the true scope of the conflict",
      ]),
    },
  };
}

const villainOrigins = [
  "Once a celebrated healer who watched their village burn while the kingdom did nothing. Now they seek to tear down the very system that abandoned them.",
  "A former guardian angel who was cast out of the heavens for showing mercy to a demon. Now they command both light and darkness.",
  "Born as the kingdom's greatest prodigy, they were experimented on by the royal mages. The experiments gave them power but stole their humanity.",
  "A grieving parent who made a deal with a void entity to resurrect their child. The price was their conscience.",
  "They were the original chosen one, but the prophecy chose someone else. Betrayed by fate itself.",
];

export function generateVillain(archetype?: string) {
  return {
    type: "villain",
    result: {
      Name: `${pick(firstNames)} ${pick(lastNames)}`,
      Archetype: archetype || pick(["Fallen Hero", "Mad Scholar", "Conqueror", "Trickster", "Vengeful Spirit"]),
      "Origin Story": pick(villainOrigins),
      Motivation: pick(["Revenge against the world", "Twisted sense of justice", "Desire to reshape reality", "Obsession with immortality", "Protecting something at any cost"]),
      Weakness: pick(["Remnants of their former compassion", "A person they still secretly love", "Their own hubris", "The source of their power is also killing them"]),
    },
  };
}

const kingdoms = ["Valdris", "Nymeria", "Kaelthorn", "Ashenmoor", "Celestine", "Drakenvale", "Frostveil"];
const magicSystems = [
  "Runic Weaving — magic is channeled through ancient symbols inscribed on the body",
  "Soulbinding — mages bond with elemental spirits to cast spells",
  "Bloodcraft — power drawn from one's own life force",
  "Starlight Channeling — magic only works under celestial alignments",
  "Dreamwalking — spells are cast by entering the dream realm",
];
const lore = [
  "The world was created when two primordial gods clashed, their bodies forming the continents.",
  "Magic was once free and wild, until the First Mage sealed it into ley lines.",
  "There are seven hidden realms layered on top of each other, each with different laws of physics.",
  "The moon is actually a sleeping god, and when it wakes, the world will end.",
];

export function generateWorld(theme?: string) {
  return {
    type: "world",
    result: {
      "Kingdom Name": pick(kingdoms),
      Theme: theme || "Dark Fantasy",
      "Magic System": pick(magicSystems),
      "World Lore": pick(lore),
      "Notable Feature": pick([
        "A floating city above the clouds",
        "An ocean that glows with bioluminescent magic",
        "A forest where time stands still",
        "Twin suns that cause seasons of fire and ice",
        "A mountain that whispers prophecies to those who climb it",
      ]),
    },
  };
}
