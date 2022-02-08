export interface Job {
   name: string;
   salary: string;
   requirements: {
      lorem: number;
   };
   costs: {
      lorem: number;
   };
   loremProduction: number;
   tier: number;
}
export const JOB_DATA: ReadonlyArray<Job> = [
   {
      name: "Intern",
      salary: "N/A",
      requirements: {
         lorem: 0
      },
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 1
   },
   {
      name: "Worker",
      salary: "N/A",
      requirements: {
         lorem: 100
      },
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 2
   },
   {
      name: "Manager",
      salary: "N/A",
      requirements: {
         lorem: 500
      },
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 3
   },
   {
      name: "Technician",
      salary: "N/A",
      requirements: {
         lorem: 600
      },
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 3
   },
   {
      name: "Director",
      salary: "N/A",
      requirements: {
         lorem: 2500
      },
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