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
   /** The index of the upgrade's icon in the spritesheet */
   readonly icon?: number;
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
         lorem: 50
      },
      tier: 1,
      icon: 32 * 0 + 0,
      id: 1
   },

   /** TIER 2 **/
   {
      name: "Intern Motivation",
      description: <>Achievements create motivation. Intern production is increased by motivation.</>,
      iconSrc: "",
      costs: {
         lorem: 200,
         workers: {
            1: 10
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
         lorem: 500
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
      description: <>Each word gives <b>0.1</b> more base lorem.</>,
      flavourText: "Give up!",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.3
      },
      costs: {
         lorem: 5
      },
      unlockRequirements: {
         wordsTyped: 10
      },
      icon: 32 * 1 + 0,
      id: 11
   },
   {
      name: "Performance Enhancing Substances",
      description: <>Each word gives <b>0.2</b> more base lorem.</>,
      flavourText: "speeEEEEEEEEED",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 0.5
      },
      costs: {
         lorem: 30
      },
      unlockRequirements: {
         wordsTyped: 60
      },
      icon: 32 * 1 + 1,
      id: 13
   },
   {
      name: "Bigger Keys",
      description: <>You type <b>1.5x</b> faster.</>,
      flavourText: "Twice the surface area, twice the lorem!",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 15
      },
      unlockRequirements: {
         wordsTyped: 50
      },
      icon: 32 * 3 + 0,
      id: 12
   },
   {
      name: "Reinforced Keys",
      description: <>You type <b>1.5x</b> faster.</>,
      flavourText: "Titanium keys... ouch.",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 100
      },
      unlockRequirements: {
         wordsTyped: 100
      },
      icon: 32 * 3 + 1,
      id: 18
   },
   {
      name: "Second keyboard",
      description: <>You type <b>1.5x</b> faster.</>,
      flavourText: "Twice the keyboards, twice the carpal tunnelling.",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 1000
      },
      unlockRequirements: {
         wordsTyped: 300
      },
      icon: 32 * 3 + 2,
      id: 21
   },
   {
      name: "Clickier Keys",
      description: <>You type <b>1.5x</b> faster.</>,
      flavourText: "click clack",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 5000
      },
      unlockRequirements: {
         wordsTyped: 600
      },
      id: 35
   },
   {
      name: "RGB Keys",
      description: <>You type <b>1.5x</b> faster.</>,
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 10000
      },
      unlockRequirements: {
         wordsTyped: 900
      },
      id: 22
   },
   {
      name: "The Polykey",
      description: <>You type <b>1.5x</b> faster.</>,
      flavourText: "By combining all your keys into a singular writhing mass of keys, you can increase typing speed significantly!",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 25000
      },
      unlockRequirements: {
         wordsTyped: 1500
      },
      icon: 32 * 3 + 5,
      id: 36
   },
   {
      name: "Neural Key Integration",
      description: <>You type <b>1.5x</b> faster.</>,
      flavourText: "You now type using your mind.",
      iconSrc: "",
      effects: {
         typingSpeedBonus: 0.5
      },
      costs: {
         lorem: 100000
      },
      unlockRequirements: {
         wordsTyped: 3000
      },
      icon: 32 * 3 + 6,
      id: 37
   },
   {
      name: "Ergonomic chair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Your back will thank you later.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 10
      },
      unlockRequirements: {
         wordsTyped: 50
      },
      icon: 32 * 2 + 0,
      id: 14
   },
   {
      name: "Wheelie chair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Your chair now has wheels. You can spin around on it. Do you feel cool yet?",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 75
      },
      unlockRequirements: {
         wordsTyped: 100
      },
      icon: 32 * 2 + 1,
      id: 23
   },
   {
      name: "Extra wheels",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "wheEEEEEEELS",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 720
      },
      unlockRequirements: {
         wordsTyped: 450
      },
      icon: 32 * 2 + 2,
      id: 24
   },
   {
      name: "Even more wheels",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Alright I swear this is the final wheel upgrade. Or IS IT? >:))",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 1500
      },
      unlockRequirements: {
         wordsTyped: 700
      },
      icon: 32 * 2 + 3,
      id: 25
   },
   {
      name: "Recursive wheels",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Your wheels... have WHEELS! This feels wrong.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 4000
      },
      unlockRequirements: {
         wordsTyped: 1000
      },
      icon: 32 * 2 + 4,
      id: 26
   },
   {
      name: "Gold Plated Chair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Fit for a king. Or a really wealthy intern.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 8000
      },
      unlockRequirements: {
         wordsTyped: 1300
      },
      icon: 32 * 2 + 5,
      id: 34
   },
   {
      name: "Hoverchair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "This upgrade sounds cool, but in reality you just strapped a bunch of large fans to your chair. It looks stupid, but the performance benefits are undeniable.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 20000
      },
      unlockRequirements: {
         wordsTyped: 1600
      },
      id: 27
   },
   {
      name: "Uber chair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "By absorbing nearby chairs, your chair grows in power. Be wary.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 50000
      },
      unlockRequirements: {
         wordsTyped: 1900
      },
      id: 28
   },
   {
      name: "Rocket Powered Chair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "They told you that strapping rockets to your chair would be 'unsafe' and 'stupid'. They weren't wrong, but it sure is cool.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 100000
      },
      unlockRequirements: {
         wordsTyped: 2200
      },
      icon: 32 * 2 + 8,
      id: 31
   },
   {
      name: "Uranium-235 Powered Chair",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Uses only the finest unstable isotopes. Side effects include: Extra limbs. Which may not actually be a bad thing.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 250000
      },
      unlockRequirements: {
         wordsTyped: 2500
      },
      icon: 32 * 2 + 9,
      id: 32
   },
   {
      name: "Inderdimensional Chair Hyperdrive",
      description: <>Words create <b>twice</b> as much lorem.</>,
      flavourText: "Your chair now exists across dimensions, resulting in unparalleled speeds.",
      iconSrc: "",
      effects: {
         multiplicativeTypingProductionBonus: 1
      },
      costs: {
         lorem: 500000
      },
      unlockRequirements: {
         wordsTyped: 2800
      },
      icon: 32 * 2 + 10,
      id: 33
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
   {
      name: "Hidden Camera Surveillance",
      description: <>Workers are <b>twice</b> as effective.</>,
      flavourText: "Privacy is a social construct.",
      iconSrc: "",
      effects: {
         workerBonuses: {
            multiplicative: 1
         }
      },
      costs: {
         lorem: 3000
      },
      unlockRequirements: {
         totalWorkers: 25
      },
      id: 38
   },
   {
      name: "Finger Bracings",
      description: <>Words create <b>1.5x</b> as much lorem.</>,
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
      icon: 32 * 0 + 1,
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

/** Sorts all upgrades (main and minor) by lorem cost */
const sortUpgradesByLoremCost = (): Array<UpgradeInfo> => {
   const sortedUpgrades = new Array<UpgradeInfo>();
   const allUpgrades = [ ...MAIN_UPGRADE_DATA, ...MINOR_UPGRADE_DATA ];
   for (const upgrade of allUpgrades) {
      if (typeof upgrade.costs.lorem === "undefined") continue;

      if (sortedUpgrades.length === 0) {
         sortedUpgrades.push(upgrade);
      } else {
         let hasInserted = false;
         for (let i = 0; i < sortedUpgrades.length; i++) {
            const upgrade2 = sortedUpgrades[i];
            if (upgrade2.costs.lorem! >= upgrade.costs.lorem!) {
               hasInserted = true;
               sortedUpgrades.splice(i, 0, upgrade);
               break;
            }
         }

         if (!hasInserted) {
            sortedUpgrades.push(upgrade);
         }
      }
   }
   return sortedUpgrades;
}

/** Approximates the path that the user would take when buying upgrades */
const showUpgradePath = (): void => {
   const upgrades = sortUpgradesByLoremCost();

   let log = "";
   for (const upgrade of upgrades) {
      log += `${upgrade.name} (${upgrade.costs.lorem!} lorem) -> `;
   }

   console.log(log);
}
showUpgradePath();