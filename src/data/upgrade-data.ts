export interface UpgradeInfo {
   readonly name: string;
   readonly description: string;
   readonly requirements: {
      readonly lorem?: number;
      readonly workers?: { [key: string]: number };
   };
   readonly tier: number;
   isBought?: boolean;
}
const UPGRADES: Array<UpgradeInfo> = [
   {
      name: "Typewriter",
      description: "Lorem generation through typing is doubled.",
      requirements: {
         lorem: 5
      },
      tier: 1
   },
   {
      name: "Intern Motivation",
      description: "Achievements create motivation. Intern production is increased by motivation.",
      requirements: {
         lorem: 20,
         workers: {
            interns: 5
         }
      },
      tier: 2
   },
   {
      name: "Touch Typing",
      description: "Chance to generate lorem when typing any character, not just words.",
      requirements: {
         lorem: 50
      },
      tier: 2
   },
   {
      name: "Corporate Heirarchy",
      description: "Each worker increases the productivity of their direct subordinates by 10%.",
      requirements: {
         lorem: 100,
         workers: {
            interns: 10,
            employees: 1
         }
      },
      tier: 3
   },
   {
      name: "Disciplinary Techniques",
      description: "Each non-intern worker increases all intern's base lorem production by 0.01.",
      requirements: {
         workers: {
            interns: 20
         }
      },
      tier: 3
   },
   {
      name: "Mechanical Keyboard", 
      description: "Typing has a small chance to create a random worker.",
      requirements: {
         lorem: 200
      },
      tier: 3
   }
];

export default UPGRADES;