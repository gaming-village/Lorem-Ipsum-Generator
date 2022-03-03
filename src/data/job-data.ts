interface JobTierInfo {
   /** How much lorem is required to be able to promote to the job */
   readonly requirements: number;
   /** How much (theoretical) money the job pays */
   readonly salary: string;
   readonly benefits: Array<string>;
   /** The base cost to buy the worker */
   readonly initialCost: number;
   /** How much lorem the worker produces each second */
   readonly loremProduction: number;
}
export const JOB_TIER_DATA: ReadonlyArray<JobTierInfo> = [
   {
      requirements: 0,
      salary: "N/A",
      benefits: [
         "Unlock the Upgrades panel."
      ],
      initialCost: 10,
      loremProduction: 0.01
   },
   {
      requirements: 15,
      salary: "$100",
      benefits: [
         "Ability to buy workers."
      ],
      initialCost: 25,
      loremProduction: 0.1
   },
   {
      requirements: 150,
      salary: "$6000",
      benefits: [],
      initialCost: 75,
      loremProduction: 0.5
   },
   {
      requirements: 1000,
      salary: "$50000",
      benefits: [],
      initialCost: 150,
      loremProduction: 3
   },
   {
      requirements: 10000,
      salary: "$150000",
      benefits: [],
      initialCost: 500,
      loremProduction: 10
   }
];

export interface Job {
   readonly id: string;
   readonly name: string;
   readonly benefits: Array<string>;
   readonly description: string;
   readonly requirement?: string;
   readonly tier: number;
}
export const JOB_DATA: ReadonlyArray<Job> = [
   /** TIER 1 **/
   {
      id: "interns",
      name: "Intern",
      benefits: [
         "Nothing, you suck."
      ],
      description: "The Intern is an exceedingly common species, ripe for exploiting. Having just been admitted into LoremCorp, it knows little of what years of lorem mining await it.",
      tier: 1
   },

   /** TIER 2 **/
   {
      id: "employees",
      name: "Employee",
      benefits: [
         "Workers generate 1.5x as much lorem."
      ],
      description: "Employees have just begun their holy pilgrimage up the sacred Way of Lorem, yet are more valuable than lesser life-forms such as the Intern. Way enough pain and suffering, they too may one day hope to achieve Enlightenment",
      tier: 2
   },
   {
      id: "programmers",
      name: "Programmer",
      benefits: [
         "Increases lorem generated from typing by 1.5x."
      ],
      description: "Much like a monkey with a keyboard, the common Programmer spends its days aimlessly bashing its calloused fingers into the remnants of what used to be its keyboard.",
      tier: 2
   },
   {
      id: "janitors",
      name: "Janitor",
      benefits: [],
      description: "Janitors are a crucial part of the Lorem ecosystem - without any janitors, Executives would have no-one to shout at, which is undoubtedly one of the most pressing issues in current times.",
      tier: 2
   },

   /** TIER 3 **/
   {
      id: "managers",
      name: "Manager",
      benefits: [
         "Interns generate 2x as much lorem.",
         "All workers are 10% cheaper."
      ],
      description: "The Manager spends its days perusing the lifeless office, ensuring that no soul in its presence enjoys but the slightest sliver of happiness - an exemplary leader.",
      requirement: "Employee",
      tier: 3
   },
   {
      id: "technicians",
      name: "Technician",
      benefits: [
         "Typing correct characters gives 7x as much lorem."
      ],
      description: "Despite its simple appearance, the Technician can do much more than plug power cables together - its superior intellect allows it to produce lorem at blistering speeds, with proper training.",
      requirement: "Programmer",
      tier: 3
   },
   {
      id: "developers",
      name: "Web Developer",
      benefits: [
         "Increases lorem generated from typing by 2x."
      ],
      description: "Web Developers work tirelessly to change text alignment and center div's, often working deep into the night to trying to figure out how to make a pull request.",
      requirement: "Programmer",
      tier: 3
   },
   {
      id: "agents",
      name: "Secret Agent",
      benefits: [],
      description: "",
      requirement: "Janitor",
      tier: 3
   },

   /** TIER 4 **/
   {
      id: "directors",
      name: "Director",
      benefits: [
         "Each worker increases the production of its direct subordinates by 2%."
      ],
      description: "An expert at both major-management and micro-management, the Director has evolved past its former husk of a self, becoming an integral part of the lorem production workflow.",
      requirement: "Manager",
      tier: 4
   },
   {
      id: "test",
      name: "test",
      benefits: [
         "TODO"
      ],
      description: "",
      tier: 4
   }
];