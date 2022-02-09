interface JobRequirements {
   lorem: number;
}
interface JobCosts {
   lorem: number;
}
export interface Job {
   readonly id: string;
   readonly name: string;
   readonly salary: string;
   readonly requirements: JobRequirements;
   readonly costs: JobCosts;
   readonly loremProduction: number;
   readonly tier: number;
}

const JOB_DATA: ReadonlyArray<Job> = [
   {
      id: "interns",
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
      id: "workers",
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
      id: "managers",
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
      id: "technicians",
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
      id: "directors",
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

export default JOB_DATA;