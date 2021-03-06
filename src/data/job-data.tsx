interface JobTierInfo {
   /** How much lorem is required to be able to promote to the job */
   readonly loremRequirements: number;
   /** How much (theoretical) money the job pays */
   readonly salary: string;
   readonly benefits: Array<string>;
   /** The base cost to buy the worker */
   readonly baseCost: number;
   /** How much lorem the worker produces each second */
   readonly loremProduction: number;
}
export const JOB_TIER_DATA: ReadonlyArray<JobTierInfo> = [
   {
      loremRequirements: 0,
      salary: "N/A",
      benefits: [
         "The Upgrades panel."
      ],
      baseCost: 10,
      loremProduction: 0.01
   },
   {
      loremRequirements: 15,
      salary: "$1000",
      benefits: [
         "The ability to buy workers."
      ],
      baseCost: 100,
      loremProduction: 0.1
   },
   {
      loremRequirements: 1000,
      salary: "$20000",
      benefits: [
         "Access to the start menu",
         "Access to the Career Path section"
      ],
      baseCost: 1e3,
      loremProduction: 1
   },
   {
      loremRequirements: 1e6,
      salary: "$100000",
      benefits: [
         "The Daily Indoctrination",
         "Lorem Packs"
      ],
      baseCost: 1e4,
      loremProduction: 10
   },
   {
      loremRequirements: 1e10,
      salary: "$250000",
      benefits: [],
      baseCost: 1e5,
      loremProduction: 100
   },
   {
      loremRequirements: 1e15,
      salary: "$1,000,000",
      benefits: [],
      baseCost: 1e6,
      loremProduction: 1000
   }
];

export interface JobInfo {
   readonly id: string;
   readonly name: string;
   readonly benefits: Array<JSX.Element>;
   readonly description: string;
   /** When present, only the jobs listed will be able to promote into the job */
   readonly jobOrigins?: ReadonlyArray<string>;
   readonly tier: number;
}
export const JOB_DATA: ReadonlyArray<JobInfo> = [
   /** TIER 1 **/
   {
      id: "interns",
      name: "Intern",
      benefits: [
         <>Nothing, you suck.</>
      ],
      description: "The Intern is an exceedingly common species, ripe for exploiting. Having just been admitted into LoremCorp, it knows little of what years of lorem mining await it.",
      tier: 1
   },

   /** TIER 2 **/
   {
      id: "employees",
      name: "Employee",
      benefits: [
         <>Workers generate 1.5x as much lorem.</>
      ],
      description: "Employees have just begun their holy pilgrimage up the sacred Way of Lorem, yet are more valuable than lesser life-forms such as the Intern. With enough pain and suffering, they too may one day hope to achieve Enlightenment.",
      tier: 2
   },
   {
      id: "programmers",
      name: "Programmer",
      benefits: [
         <>Increases lorem generated from all forms of typing by <b>1.5x</b>.</>
      ],
      description: "Much like a monkey with a keyboard, the common Programmer spends its days aimlessly bashing its calloused fingers into the remnants of what used to be its keyboard.",
      tier: 2
   },

   /** TIER 3 **/
   {
      id: "managers",
      name: "Manager",
      benefits: [
         <>Workers generate 2x as much lorem.</>,
         <>Workers are 10% cheaper.</>
      ],
      description: "The Manager spends its days perusing the lifeless office, ensuring that no soul in its presence enjoys but the slightest sliver of happiness - an exemplary leader.",
      jobOrigins: ["Employee"],
      tier: 3
   },
   {
      id: "developers",
      name: "Web Developer",
      benefits: [
         <>Increases lorem generated from all forms of typing by <b>2x</b>.</>
      ],
      description: "Web Developers work tirelessly to change text alignment and center div's, often working deep into the night to trying to figure out how to make a pull request.",
      jobOrigins: ["Programmer"],
      tier: 3
   },
   {
      id: "help-desk-technicians",
      name: "Help Desk Technician",
      benefits: [
         <>Typing correct characters gives 7x as much lorem.</>
      ],
      description: "TODO",
      jobOrigins: ["Programmer"],
      tier: 3
   },

   /** TIER 4 **/
   {
      id: "directors",
      name: "Director",
      benefits: [
         <>Each worker increases the production of its direct subordinates by 2%.</>
      ],
      description: "An expert at both major-management and micro-management, the Director has evolved past its former husk of a self, becoming an integral part of the lorem production workflow.",
      jobOrigins: ["Manager"],
      tier: 4
   },
   {
      id: "full-stack-developers",
      name: "Full Stack Developer", 
      benefits: [
         <></>
      ],
      description: "TODO",
      jobOrigins: ["Web Developer"],
      tier: 4
   },
   {
      id: "it-director",
      name: "IT Director", 
      benefits: [
         <></>
      ],
      description: "TODO",
      jobOrigins: ["Web Developer", "Help Desk Technician"],
      tier: 4
   },
   {
      id: "technicians",
      name: "Technician",
      benefits: [
         <>Typing correct characters gives 7x as much lorem.</>
      ],
      description: "Despite its simple appearance, the Technician can do much more than plug power cables together - its superior intellect allows it to produce lorem at blistering speeds, with proper training.",
      jobOrigins: ["Help Desk Technician"],
      tier: 4
   },
   {
      id: "it-support-specialists",
      name: "IT Support Specialist",
      benefits: [
         <>Typing correct characters gives 7x as much lorem.</>
      ],
      description: "TODO",
      jobOrigins: ["Help Desk Technician"],
      tier: 4
   },

   /** TIER 5 **/
   {
      id: "executives",
      name: "Executive",
      benefits: [
         <></>
      ],
      description: "",
      jobOrigins: ["Director"],
      tier: 5
   },
   {
      id: "board-members",
      name: "Board Member",
      benefits: [
         <></>
      ],
      description: "",
      jobOrigins: ["Director"],
      tier: 5
   },

   /** TIER 6 */
   {
      id: "ceos",
      name: "CEO",
      benefits: [
         <></>
      ],
      description: "",
      jobOrigins: ["Executive", "Board Member"],
      tier: 6
   }
];