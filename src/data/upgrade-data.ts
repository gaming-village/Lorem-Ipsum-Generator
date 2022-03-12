export interface UpgradeInfo {
   readonly name: string;
   readonly description: string;
   readonly flavourText?: string;
   readonly requirements: {
      readonly lorem?: number;
      /** What workers are required for the upgrade. Key = worker tier, value = amount of workers */
      readonly workers?: { [key: number]: number };
   };
   readonly tier: number;
   isBought?: boolean;
   /** The upgrade's unique identifier. Doesn't need to be in any pattern or order, just needs to be unique for every upgrade */
   readonly id: number;
}
const UPGRADE_DATA: Array<UpgradeInfo> = [
   /** TIER 1 **/
   {
      name: "Typewriter",
      description: "Lorem generation through typing is doubled.",
      requirements: {
         lorem: 5
      },
      tier: 1,
      id: 1
   },

   /** TIER 2 **/
   {
      name: "Intern Motivation",
      description: "Achievements create motivation. Intern production is increased by motivation.",
      requirements: {
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
      description: "Chance to generate lorem when typing any character, not just words.",
      requirements: {
         lorem: 50
      },
      tier: 2,
      id: 3
   },

   /** TIER 3 **/
   {
      name: "Micro Management",
      description: "Each worker increases the productivity of their direct subordinates by 10%.",
      requirements: {
         lorem: 100,
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
      description: "Each non-intern worker increases all intern's base lorem production by 0.01.",
      requirements: {
         workers: {
            1: 10
         }
      },
      tier: 3,
      id: 5
   },
   {
      name: "Mechanical Keyboard",
      description: "Typing has a small chance to instantly complete a word.",
      requirements: {
         lorem: 200
      },
      tier: 3,
      id: 6
   },

   /** TIER 4 **/
   {
      name: "AGILE Development",
      description: "Workers generate 50% more lorem and get 50% less sleep.",
      requirements: {
         workers: {
            1: 15
         }
      },
      tier: 4,
      id: 7
   },
   {
      name: "Company Restructure",
      description: "All workers produce 10% more lorem.",
      requirements: {
         lorem: 200
      },
      tier: 4,
      id: 8
   },
   {
      name: "Planned Obsolescence",
      description: "When enough characters have been typed, they all get sacrificed for more lorem.",
      requirements: {
         lorem: 1000
      },
      tier: 4,
      id: 9
   },

   /** TIER 5 **/
   {
      name: "Sentient Keyboard",
      description: "Typing is done automatically (but very slowly).",
      flavourText: "Significant advances in science has allowed the consciousness of an intern to be placed into a keyboard, resulting in semi-automatic typing.",
      requirements: {
         lorem: 0
      },
      tier: 5,
      id: 10
   }
];

export default UPGRADE_DATA;