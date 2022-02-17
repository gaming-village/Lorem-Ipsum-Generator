interface JobTierInfo {
   readonly requirements: number;
   readonly benefits: Array<string>;
   readonly initialCost: number;
}
export const JOB_TIER_DATA: ReadonlyArray<JobTierInfo> = [
   {
      requirements: 0,
      benefits: [""],
      initialCost: 10
   },
   {
      requirements: 25,
      benefits: [
         "Ability to buy workers."
      ],
      initialCost: 25
   },
   {
      requirements: 100,
      benefits: [
         "Unlock the Upgrades panel.",
      ],
      initialCost: 75
   },
   {
      requirements: 250,
      benefits: [],
      initialCost: 150
   }
];

export interface Job {
   readonly id: string;
   readonly name: string;
   readonly salary: string;
   readonly benefits: Array<string>;
   readonly requirement?: string;
   readonly loremProduction: number;
   readonly tier: number;
}
export const JOB_DATA: ReadonlyArray<Job> = [
   // TIER 1
   {
      id: "interns",
      name: "Intern",
      salary: "N/A",
      benefits: [
         "Nothing, you suck."
      ],
      loremProduction: 0.01,
      tier: 1
   },
   // TIER 2
   {
      id: "employees",
      name: "Employee",
      salary: "$10",
      benefits: [
         "Workers generate 1.5x as much lorem."
      ],
      loremProduction: 0.1,
      tier: 2
   },
   {
      id: "programmers",
      name: "Programmer",
      salary: "$9",
      benefits: [
         "Increases lorem generated from typing by 2x."
      ],
      loremProduction: 0.05,
      tier: 2
   },
   // TIER 3
   {
      id: "managers",
      name: "Manager",
      salary: "N/A",
      benefits: [
         "Interns generate 2x as much lorem.",
         "All workers are 10% cheaper."
      ],
      requirement: "Employee",
      loremProduction: 0.25,
      tier: 3
   },
   {
      id: "technicians",
      name: "Technician",
      salary: "$1000",
      benefits: [
         "Increases lorem generated from typing by 2x."
      ],
      requirement: "Programmer",
      loremProduction: 0.15,
      tier: 3
   },
   {
      id: "developers",
      name: "Web Developer",
      salary: "$1000",
      benefits: [
         "Increases lorem generated from typing by 2x."
      ],
      requirement: "Programmer",
      loremProduction: 0.15,
      tier: 3
   },
   // TIER 4
   {
      id: "directors",
      name: "Director",
      salary: "N/A",
      benefits: [
         "TODO"
      ],
      requirement: "Manager",
      loremProduction: 0.01,
      tier: 4
   },
   {
      id: "test",
      name: "test",
      salary: "N/A",
      benefits: [
         "TODO"
      ],
      loremProduction: 0.01,
      tier: 4
   }
];

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
export const UPGRADES: Array<UpgradeInfo> = [
   {
      name: "Typewriter",
      description: "Lorem generation through typing is doubled.",
      requirements: {
         lorem: 10
      },
      tier: 1
   },
   {
      name: "Intern Motivation",
      description: "Achievements create motivation. Intern production is increased by motivation.",
      requirements: {
         lorem: 20,
         workers: {
            intern: 5
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
            intern: 10,
            employee: 1
         }
      },
      tier: 3
   },
   {
      name: "Disciplinary Techniques",
      description: "Each non-intern worker increases all intern's base lorem production by 0.01.",
      requirements: {
         workers: {
            intern: 20
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
]