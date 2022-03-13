export interface UpgradeInfo {
   readonly name: string;
   readonly description: JSX.Element;
   readonly flavourText?: string;
   readonly iconSrc: string;
   /** Typical effects which upgrades usually have. Calculated automatically */
   readonly effects?: {
      readonly additiveTypingProductionBonus?: number;
      readonly multiplicativeTypingProductionBonus?: number;
      readonly additiveWorkerProductionBonus?: number;
      readonly multiplicativeWorkerProductionBonus?: number;
      readonly individualWorkerBonuses?: {
         [key: number]: {
            readonly additiveBonus?: number;
            readonly multiplicativeBonus?: number;
         }
      };
      readonly workerBonuses?: {
         readonly additive?: number;
         readonly multiplicative?: number;
      }
   }
   readonly costs: {
      readonly lorem?: number;
      /** What workers are required for the upgrade. Key = worker tier, value = amount of workers */
      readonly workers?: { [key: number]: number };
   };
   isBought?: boolean;
   /** The upgrade's unique identifier. Doesn't need to be in any pattern or order, just needs to be unique for every upgrade */
   readonly id: number;
}

export interface MainUpgradeInfo extends UpgradeInfo {
   readonly tier: number;
}

export interface MinorUpgradeInfo extends UpgradeInfo {
   readonly unlockRequirements: {
      /** Name of the achievement required to unlock the upgrade */
      readonly achievement?: string;
      readonly wordsTyped?: number;
      readonly workers?: {
         [key: number]: number;
      }
   }
   isUnlocked?: boolean;
}

export const MAIN_UPGRADE_DATA: Array<MainUpgradeInfo> = [
   /** TIER 1 **/
   {
      name: "Typewriter",
      description: <>Typing is <b>twice</b> as effective.</>,
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 10
      },
      tier: 1,
      id: 1
   },

   /** TIER 2 **/
   {
      name: "Intern Motivation",
      description: <>Achievements create motivation. Intern production is increased by motivation.</>,
      iconSrc: "",
      costs: {
         lorem: 20,
         workers: {
            1: 5
         }
      },
      tier: 2,
      id: 2
   },
   {
      name: "Touch Typing",
      description: <>Chance to generate lorem when typing any character, not just words.</>,
      iconSrc: "",
      costs: {
         lorem: 50
      },
      tier: 2,
      id: 3
   },

   /** TIER 3 **/
   {
      name: "Micro Management",
      description: <>Each worker increases the productivity of their direct subordinates by 10%.</>,
      iconSrc: "",
      costs: {
         lorem: 150,
         workers: {
            1: 10,
            2: 1
         }
      },
      tier: 3,
      id: 4
   },
   {
      name: "Disciplinary Techniques",
      description: <>Each non-intern worker increases all intern's base lorem production by 0.01.</>,
      iconSrc: "",
      costs: {
         workers: {
            1: 10
         }
      },
      tier: 3,
      id: 5
   },
   {
      name: "Mechanical Keyboard",
      description: <>Typing has a small chance to instantly complete a word.</>,
      iconSrc: "",
      costs: {
         lorem: 250
      },
      tier: 3,
      id: 6
   },

   /** TIER 4 **/
   {
      name: "AGILE Development",
      description: <>Workers generate 50% more lorem and get 50% less sleep.</>,
      iconSrc: "",
      effects: {
         multiplicativeWorkerProductionBonus: 0.5
      },
      costs: {
         workers: {
            1: 15
         }
      },
      tier: 4,
      id: 7
   },
   {
      name: "Company Restructure",
      description: <>All workers are twice as effective.</>,
      iconSrc: "",
      effects: {
         multiplicativeWorkerProductionBonus: 1
      },
      costs: {
         lorem: 200
      },
      tier: 4,
      id: 8
   },
   {
      name: "Planned Obsolescence",
      description: <>When enough characters have been typed, they all get sacrificed for more lorem.</>,
      iconSrc: "",
      costs: {
         lorem: 1000
      },
      tier: 4,
      id: 9
   },

   /** TIER 5 **/
   {
      name: "Sentient Keyboard",
      description: <>Typing is done automatically (but very slowly).</>,
      flavourText: "Significant advances in questionable areas of science has allowed the consciousness of an intern to be placed into a keyboard, resulting in semi-automatic typing.",
      iconSrc: "",
      costs: {
         lorem: 1e4
      },
      tier: 5,
      id: 10
   },
   {
      name: "Hivemind",
      description: <>Unlocks the Intern Enhancement Facility.</>,
      flavourText: "At all costs...",
      iconSrc: "",
      costs: {
         lorem: 1e5
      },
      tier: 5,
      id: 15
   }
];

export const MINOR_UPGRADE_DATA: ReadonlyArray<MinorUpgradeInfo> = [
   {
      name: "'Motivational' Poster",
      description: <>Typing is <b>1.3x</b> as effective.</>,
      flavourText: "Give up!",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.3
      },
      costs: {
         lorem: 10
      },
      unlockRequirements: {
         wordsTyped: 25
      },
      id: 11
   },
   {
      name: "Bigger Keys",
      description: <>Each word gives <b>0.1</b> more lorem.</>,
      flavourText: "Twice the surface area, twice the lorem!",
      iconSrc: "",
      effects: {
         additiveTypingProductionBonus: 0.1
      },
      costs: {
         lorem: 15
      },
      unlockRequirements: {
         wordsTyped: 50
      },
      id: 12
   },
   {
      name: "Suspicious Substances",
      description: <>Typing is <b>1.5x</b> as effective.</>,
      flavourText: "speeEEEEEEEEED",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 30
      },
      unlockRequirements: {
         wordsTyped: 100
      },
      id: 13
   },
   {
      name: "Ergonomic chair",
      description: <>Typing is <b>1.5x</b> as effective.</>,
      flavourText: "Your back will thank you later.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 50
      },
      unlockRequirements: {
         wordsTyped: 200
      },
      id: 14
   },
   {
      name: "Wage cages",
      description: <>Interns are <b>1.5x</b> as effective.</>,
      flavourText: "'Please... no water... help...' - Intern #172934, 2003 - 2020",
      iconSrc: "",
      effects: {
         individualWorkerBonuses: {
            1: {
               multiplicativeBonus: 0.5
            }
         }
      },
      costs: {
         lorem: 100
      },
      unlockRequirements: {
         workers: {
            1: 5
         }
      },
      id: 16
   }
];