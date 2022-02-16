import { WORKER_NAMES } from "./workers";

type WorkerRequirements = {
   [key in WORKER_NAMES]?: number;
}

export interface UpgradeRequirements {
   readonly lorem?: number;
   readonly workers?: WorkerRequirements;
   readonly upgrades?: ReadonlyArray<string>;
}

export interface UpgradeInfo {
   readonly name: string;
   readonly description: string;
   readonly tier: number;
   readonly requirements: UpgradeRequirements;
   isBought?: boolean;
}

const UPGRADES: ReadonlyArray<UpgradeInfo> = [
   {
      name: "Typewriter",
      description: "Lorem generation through typing is doubled.",
      tier: 1,
      requirements: {
         lorem: 10
      }
   },
   {
      name: "Intern Motivation",
      description: "Achievements create motivation. Intern production is increased by motivation.",
      tier: 2,
      requirements: {
         lorem: 20,
         workers: {
            intern: 5
         }
      }
   },
   {
      name: "Touch Typing",
      description: "Chance to generate lorem when typing any character, not just words.",
      tier: 2,
      requirements: {
         lorem: 50,
         upgrades: ["Typewriter"]
      }
   },
   {
      name: "Corporate Heirarchy",
      description: "Each worker increases the productivity of their direct subordinates by 10%.",
      tier: 3,
      requirements: {
         lorem: 100,
         workers: {
            intern: 10,
            employee: 1
         }
      }
   },
   {
      name: "Disciplinary Techniques",
      description: "Each non-intern worker increases all intern's base lorem production by 0.01.",
      tier: 3,
      requirements: {
         workers: {
            intern: 20
         }
      }
   },
   {
      name: "Mechanical Keyboard",
      description: "Typing has a small chance to create a random worker.",
      tier: 3,
      requirements: {
         lorem: 200
      }
   }
];

export default UPGRADES;