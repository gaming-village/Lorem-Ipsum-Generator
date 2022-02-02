export type LoremCategory = "noun" | "pronoun" | "verb" | "preposition" | "adjective";
type LoremSubcategory = "place" | "person";

export interface LoremWord {
   readonly latin: string;
   readonly category: LoremCategory;
   readonly subcategory?: LoremSubcategory;
   readonly meaning: string;
   readonly value: number;
}

interface StructurePart {
   [key: number]: string | Array<string>;
}

export interface SentenceStructure {
   structure: ReadonlyArray<StructurePart>;
   meaning: ReadonlyArray<number | string>;
}

interface PackRequirements {
   readonly wordsTyped: number;
}

export interface LoremPack {
   readonly name: string;
   readonly description: string;
   readonly packImgSrc: string;
   readonly loremWords: ReadonlyArray<LoremWord>;
   readonly sentenceStructures?: ReadonlyArray<SentenceStructure>;
   readonly requirements: PackRequirements;
   isBought?: boolean;
}

const LOREM_PACKS: ReadonlyArray<LoremPack> = [
   {
      name: "Default Pack",
      description: "Included with all standard Lorem Corp machines.",
      packImgSrc: "default-pack.png",
      loremWords: [
         {
            latin: "lorem",
            category: "noun",
            meaning: "pain",
            value: 0.2
         },
         {
            latin: "ipsum",
            category: "pronoun",
            meaning: "itself",
            value: 0.1
         }
      ],
      sentenceStructures: [
         {
            structure: [{1: ["noun"]}, {2: ["pronoun"]}],
            meaning: [1, 2]
         }
      ],
      requirements: {
         wordsTyped: 0
      },
      isBought: true
   },
   {
      name: "Beginner Pack",
      description: "A basic pack, designed for inexperienced lorematicians.",
      packImgSrc: "beginner-pack.png",
      loremWords: [
         {
            latin: "ego",
            category: "pronoun",
            meaning: "I",
            value: 0.3
         },
         {
            latin: "est",
            category: "verb",
            meaning: "is",
            value: 0
         },
         {
            latin: "in",
            category: "preposition",
            meaning: "in",
            value: 0
         },
         {
            latin: "magnus",
            category: "adjective",
            meaning: "big",
            value: 0.5
         }
      ],
      sentenceStructures: [
         {
            structure: [{1: ["noun"]}, {2: ["adjective"]}, {3: "est"}],
            meaning: [1, 3, 2]
         },
         {
            structure: [{1: ["pronoun"]}, {2: "in"}, {3: ["noun"]}, {4: ["verb"]}],
            meaning: [1, "is", 4, 2, 3]
         }
      ],
      requirements: {
         wordsTyped: 50
      }
   },
   {
      name: "Basic Office Pack",
      description: "Toolkit of the clueless intern. This pack is guaranteed to leave you feeling empty and devoid of happiness.",
      packImgSrc: "basic-office-pack.png",
      loremWords: [
         {
            latin: "officus",
            category: "noun",
            meaning: "office",
            value: 0.4
         },
         {
            latin: "taediosus",
            category: "noun",
            meaning: "tedious",
            value: 0.5
         },
         {
            latin: "opus",
            category: "noun",
            meaning: "job",
            value: 0.3
         },
         {
            latin: "passio",
            category: "noun",
            meaning: "suffering",
            value: 0.1
         },
         {
            latin: "servis",
            category: "noun",
            meaning: "slave",
            value: 0.1
         },
         {
            latin: "laboro",
            category: "verb",
            meaning: "work",
            value: 0.5
         },
         {
            latin: "dormo",
            category: "verb",
            meaning: "sleep",
            value: 0.5
         }
      ],
      requirements: {
         wordsTyped: 250
      }
   }
];

export default LOREM_PACKS;