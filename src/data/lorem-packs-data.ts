export type LoremCategory = "noun" | "pronoun" | "verb" | "preposition" | "adjective";
type LoremSubcategory = "place" | "person";
export type SentenceStructure = ReadonlyArray<ReadonlyArray<LoremCategory | LoremSubcategory> | string>;

export interface LoremWord {
   readonly latin: string;
   readonly category: LoremCategory;
   readonly meaning: string;
   readonly value: number;
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
         [["noun"], ["pronoun"]]
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
         [["noun"], ["adjective"], "est"],
         [["noun"], "in", ["pronoun"], ["verb"]]
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
            meaning: "I work",
            value: 0.5
         },
         {
            latin: "dormo",
            category: "verb",
            meaning: "I sleep",
            value: 0.5
         }
      ],
      requirements: {
         wordsTyped: 250
      }
   }
];

export default LOREM_PACKS;