export type WORKER_NAMES = "intern" | "employee" | "manager" | "executive";

export interface Worker {
   readonly name: WORKER_NAMES;
   readonly salary: number;
   readonly requirements: {
      readonly lorem: number;
   }
   readonly costs: {
      readonly lorem: number;
      readonly workforce: number;
   },
   readonly loremProduction: number;
}

const WORKERS: ReadonlyArray<Worker> = [
   {
      name: "intern",
      salary: 0,
      requirements: {
         lorem: 0
      },
      costs: {
         lorem: 10,
         workforce: 1
      },
      loremProduction: 0.01
   },
   {
      name: "employee",
      salary: 1000,
      requirements: {
         lorem: 50
      },
      costs: {
         lorem: 50,
         workforce: 2
      },
      loremProduction: 10
   },
   {
      name: "manager",
      salary: 50000,
      requirements: {
         lorem: 500
      },
      costs: {
         lorem: 60,
         workforce: 3
      },
      loremProduction: 10
   },
   {
      name: "executive",
      salary: 1000000,
      requirements: {
         lorem: 5000
      },
      costs: {
         lorem: 70,
         workforce: 4
      },
      loremProduction: 100
   }
];

export default WORKERS;