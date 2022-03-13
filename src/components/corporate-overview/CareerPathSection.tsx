import Game from "../../Game";
import { JobInfo, JOB_DATA } from "../../data/job-data";

const getJobsByTier = (tier: number): ReadonlyArray<JobInfo> => {
   let jobs = new Array<JobInfo>();
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier === tier) {
         jobs.push(currentJob);
      } else if (currentJob.tier > tier) break;
   }
   return jobs;
}

interface CareerPathNode {
   status: "previousJob" | "nonSelected" | "unknown";
   job: JobInfo;
   children: Array<CareerPathNode>
}
const CareerPathSection = () => {
   const jobHistory = Game.userInfo.previousJobs;
   // Create the tree
   const careerPathTree: CareerPathNode = {
      status: "previousJob",
      job: JOB_DATA[0],
      children: new Array<CareerPathNode>()
   };
   let previousNode: CareerPathNode = careerPathTree;
   for (let i = 0; i < jobHistory.length; i++) {
      const job = jobHistory[i];
      const nextJob = jobHistory[i + 1];

      let nextNode!: CareerPathNode;
      const tierJobs = getJobsByTier(job.tier + 1);
      for (const currentJob of tierJobs) {
         let newNode!: CareerPathNode;

         const isInPath = typeof currentJob.previousJobRequirement === "undefined" || currentJob.previousJobRequirement.includes(job.name);
         if (!isInPath) continue;

         if (i === jobHistory.length - 1) {
            newNode = {
               status: "unknown",
               job: currentJob,
               children: new Array<CareerPathNode>()
            };
         } else if (currentJob === nextJob) {
            newNode = {
               status: "previousJob",
               job: currentJob,
               children: new Array<CareerPathNode>()
            }

            nextNode = newNode;
         } else {
            newNode = {
               status: "nonSelected",
               job: currentJob,
               children: new Array<CareerPathNode>()
            }
         }
         
         previousNode.children.push(newNode);
      }
      
      previousNode = nextNode;
   }

   // Won't actually be created
   const baseNode: CareerPathNode = {
      status: "unknown",
      job: JOB_DATA[0],
      children: [careerPathTree]
   };

   // Make the JSX
   let key = 0;
   const tree = new Array<JSX.Element>();
   let currentNode: CareerPathNode = baseNode;
   /** Determines each row's offest from the center */
   let offset = 0;
   for (let i = 0; ; i++) {
      if (typeof currentNode === "undefined" || currentNode.children.length === 0) {
         break;
      }

      const rowStyle = {
         "--offset": offset
      } as React.CSSProperties;
      
      // Create the job squares
      let nextNode!: CareerPathNode;
      const newRow = new Array<JSX.Element>();
      for (let j = 0; j < currentNode.children.length; j++) {
         const child = currentNode.children[j];

         // Update the offset
         if (i > 0 && child.status === "previousJob") {
            switch (currentNode.children.length) {
               case 2: {
                  if (j === 0) {
                     offset--;
                  } else {
                     offset++;
                  }
                  break;
               }
               case 3: {
                  if (j === 0) {
                     offset--
                  } else if (j === 2) {
                     offset++;
                  }
                  break;
               }
            }
         }

         const className = `item ${child.status}`;
         newRow.push(
            <div key={key++} className={className}>
               <span>{child.status === "unknown" ? "???" : child.job.name}</span>
            </div>
         );

         if (child.status === "previousJob") {
            nextNode = child;
         }
      }

      tree.push(
         <div key={key++} className="row" style={rowStyle}>
            {newRow}
         </div>
      );

      currentNode = nextNode;
   }

   return <div id="career-path">
      <p>View how your career has developed over the course of your time at LoremCorp.</p>

      {tree}
   </div>
}

export default CareerPathSection;