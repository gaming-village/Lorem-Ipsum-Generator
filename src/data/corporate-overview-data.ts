export interface Job {
   readonly id: string;
   readonly name: string;
   readonly salary: string;
   readonly costs: {
      readonly lorem: number;
   };
   readonly loremProduction: number;
   readonly tier: number;
}
export const JOB_REQUIREMENTS = [0, 100, 500, 2500];
export const JOB_DATA: ReadonlyArray<Job> = [
   // TIER 1
   {
      id: "interns",
      name: "Intern",
      salary: "N/A",
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 1
   },
   // TIER 2
   {
      id: "workers",
      name: "Worker",
      salary: "N/A",
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 2
   },
   // TIER 3
   {
      id: "managers",
      name: "Manager",
      salary: "N/A",
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 3
   },
   {
      id: "technicians",
      name: "Technician",
      salary: "N/A",
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 3
   },
   // TIER 4
   {
      id: "directors",
      name: "Director",
      salary: "N/A",
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 4
   }
];

interface Upgrade {
   name: string;
   description: string;
   requirements: {
      lorem?: number;
      workers?: { [key: string]: number };
      upgrades?: ReadonlyArray<string>;
   };
   tier: number;
}
export const UPGRADES: ReadonlyArray<Upgrade> = [
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
         lorem: 50,
         upgrades: ["Typewriter"]
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