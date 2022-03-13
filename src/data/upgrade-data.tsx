import Game from "../Game";

export interface UpgradeInfo {
   readonly name: string;
   readonly description: JSX.Element | (() => JSX.Element);
   readonly flavourText?: string;
   readonly iconSrc: string;
   /** Typical effects which upgrades usually have. Calculated automatically, not computationally demanding */
   readonly effects?: {
      readonly additiveTypingProductionBonus?: number;
      readonly multiplicativeTypingProductionBonus?: number;
      readonly additiveWorkerProductionBonus?: number;
      readonly multiplicativeWorkerProductionBonus?: number;
      /** Increases the number of characters that the user types each character type */
      readonly typingSpeedBonus?: number;
      /** Worker bonuses applied to individual types of workers */
      readonly individualWorkerBonuses?: {
         [key: number]: {
            readonly additiveBonus?: number;
            readonly multiplicativeBonus?: number;
         }
      };
      /** Worker bonuses applied to all types of workers */
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
      /** Amout of specific tiers of workers required to unlock the upgrade */
      readonly workers?: {
         [key: number]: number;
      }
      readonly totalWorkers?: number;
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
      description: <>Each word gives <b>0.1</b> more lorem.</>,
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
      name: "Performance Enhancing Substances",
      description: <>Each word gives <b>0.2</b> more lorem.</>,
      flavourText: "speeEEEEEEEEED",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 50
      },
      unlockRequirements: {
         wordsTyped: 100
      },
      id: 13
   },
   {
      name: "Bigger Keys",
      description: <>You type <b>1.3x</b> faster.</>,
      flavourText: "Twice the surface area, twice the lorem!",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.3
      },
      costs: {
         lorem: 50
      },
      unlockRequirements: {
         wordsTyped: 50
      },
      id: 12
   },
   {
      name: "Reinforced Keys",
      description: <>You type <b>1.3x</b> faster.</>,
      flavourText: "Titanium keys... ouch.",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 250
      },
      unlockRequirements: {
         wordsTyped: 100
      },
      id: 18
   },
   {
      name: "Spring-loaded Keys",
      description: <>You type <b>1.3x</b> faster.</>,
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 1000
      },
      unlockRequirements: {
         wordsTyped: 250
      },
      id: 21
   },
   {
      name: "RGB Keys",
      description: <>You type <b>1.3x</b> faster.</>,
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.3
      },
      costs: {
         lorem: 2500
      },
      unlockRequirements: {
         wordsTyped: 500
      },
      id: 22
   },
   {
      name: "Ergonomic chair",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "Your back will thank you later.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 60
      },
      unlockRequirements: {
         wordsTyped: 150
      },
      id: 14
   },
   {
      name: "Wheelie chair",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "Your chair now has wheels. You can spin around on it. Do you feel cool yet?",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 240
      },
      unlockRequirements: {
         wordsTyped: 250
      },
      id: 23
   },
   {
      name: "Extra wheels",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "wheEEEEEEELS",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 720
      },
      unlockRequirements: {
         wordsTyped: 450
      },
      id: 24
   },
   {
      name: "Even more wheels",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "Alright I swear this is the final wheel upgrade. Or IS IT? >:))",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 1500
      },
      unlockRequirements: {
         wordsTyped: 700
      },
      id: 25
   },
   {
      name: "Recursive wheels",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "Your wheels... have WHEELS! This feels wrong.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 4000
      },
      unlockRequirements: {
         wordsTyped: 1000
      },
      id: 26
   },
   {
      name: "Hoverchair",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "This upgrade sounds cool, but in reality you just strapped a bunch of large fans to your chair. It looks stupid, but the performance benefits are undeniable.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 8000
      },
      unlockRequirements: {
         wordsTyped: 1300
      },
      id: 27
   },
   {
      name: "Uber chair",
      description: <>Typing generates <b>1.5x</b> as much lorem.</>,
      flavourText: "By absorbing nearby chairs, your chair grows in power. Be wary.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 20000
      },
      unlockRequirements: {
         wordsTyped: 1600
      },
      id: 28
   },
   {
      name: "Motivation Gun",
      description: <>All workers are 1.2x as effective.</>,
      flavourText: "Fear is the greatest motivator.",
      iconSrc: "",
      effects: {
         workerBonuses: {
            multiplicative: 0.2
         }
      },
      costs: {
         lorem: 200
      },
      unlockRequirements: {
         totalWorkers: 10
      },
      id: 17
   },
   // {
   //    name: "Hidden Camera Servailence"
   // }
   {
      name: "Finger Bracings",
      description: <>Typing is <b>1.5x</b> as effective.</>,
      flavourText: "Protects the most important organs in your body - your fingers.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 1000
      },
      unlockRequirements: {
         wordsTyped: 400
      },
      id: 19
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
   },
   {
      name: "Intern Lava Moat",
      description: <>Interns are <b>1.5x</b> as effective.</>,
      flavourText: "The best way to prevent workers from leaving the office.",
      iconSrc: "",
      effects: {
         individualWorkerBonuses: {
            1: {
               multiplicativeBonus: 0.5
            }
         }
      },
      costs: {
         lorem: 800
      },
      unlockRequirements: {
         workers: {
            1: 10
         }
      },
      id: 20
   },
   {
      name: "Artificial Sunlight",
      description: <>Interns are <b>1.5x</b> as effective.</>,
      flavourText: "80% Vitamin D, 10% Plutonium, 6% Sawdust, 4% Cyanide. Side effects include: Death. Lots of death.",
      iconSrc: "",
      effects: {
         individualWorkerBonuses: {
            1: {
               multiplicativeBonus: 0.5
            }
         }
      },
      costs: {
         lorem: 2000
      },
      unlockRequirements: {
         workers: {
            1: 20
         }
      },
      id: 30
   },
   {
      name: "Employee of the Month",
      description: () => {
         const tier2WorkerName = Game.userInfo.previousJobs[1].name;
         return <>{tier2WorkerName}s are <b>1.5x</b> as effective.</>
      },
      flavourText: "Studies have shown that worker production can be increased significantly simply with a shiny piece of paper stapled to the wall.",
      iconSrc: "",
      effects: {
         individualWorkerBonuses: {
            2: {
               multiplicativeBonus: 0.5
            }
         }
      },
      costs: {
         lorem: 200
      },
      unlockRequirements: {
         workers: {
            2: 5
         }
      },
      id: 29
   }
];