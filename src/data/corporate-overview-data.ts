interface JobRequirements {
   lorem: number;
}
interface JobCosts {
   lorem: number;
}
export interface Job {
   name: string;
   salary: string;
   requirements: JobRequirements;
   costs: JobCosts;
   loremProduction: number;
   tier: number;
}

const JOB_DATA: ReadonlyArray<Job> = [
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
         lorem: 0
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
         lorem: 0
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
         lorem: 0
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
         lorem: 0
      },
      costs: {
         lorem: 0
      },
      loremProduction: 0.01,
      tier: 4
   }
];

export default JOB_DATA;