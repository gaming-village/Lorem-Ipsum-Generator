import { useEffect, useState } from "react";

import Button from "../Button";

import ControlPanel from "./ControlPanel";
import PromotionScreen from "./PromotionScreen";
import ProfileSection from "./ProfileSection";
import UpgradeSection, { hasUpgrade, individualWorkerProductionBonuses, updateUnlockedWorkerUpgrades, workerProductionBonuses } from "./UpgradeSection";
import CareerPathSection from "./CareerPathSection";

import Game from "../../Game";
import { JOB_DATA, JOB_TIER_DATA, JobInfo, } from "../../data/job-data";
import { getPrefix, getTriangularNumber, randItem, roundNum } from "../../utils";

import "../../css/corporate-overview.css";

export function getRandomWorker(): JobInfo {
   let potentialJobs = Game.userInfo.previousJobs.slice();
   // Remove the current job
   potentialJobs.splice(potentialJobs.length - 1, 1);

   return randItem(potentialJobs);
}
/**
 * Used to find whether the user is or has previously been a certain job.
 * @param name The name of the job
 * @returns If user has had the job.
 */
export function hasJob(name: string): boolean {
   // Find the job using the job name
   let job: JobInfo | undefined;
   for (const currentJob of JOB_DATA) {
      if (currentJob.name === name) {
         job = currentJob;
         break;
      }
   }

   if (typeof job === "undefined") {
      console.trace();
      throw new Error(`Job '${name}' doesn't exist!`)
   }

   return Game.userInfo.previousJobs.includes(job);
}

export interface SectionProps {
   job: JobInfo;
   promoteFunc?: () => void
}

const getNonInternWorkerCount = (): number => {
   let total = 0;
   for (const worker of JOB_DATA) {
      if (worker.name === "Intern") continue;
      const count = Game.userInfo.workers[worker.id];
      total += count;
   }
   return total;
}

/** Gets the total number of a worker's direct subordinates */
const getSubordinateCount = (worker: JobInfo): number => {
   let subordinateCount = 0;
   for (const currentWorker of JOB_DATA) {
      if (currentWorker.tier > worker.tier) break;

      if (currentWorker.tier === worker.tier - 1) {   
         const count = Game.userInfo.workers[currentWorker.id];
         subordinateCount += count;
      }
   }
   return subordinateCount;
}

/**
 * Calculates how much one of a certain worker type would produce
 * @param worker The worker
 */
const getSingularWorkerProduction = (worker: JobInfo): number => {
   // Quick fun fact: this is actually the only place where ".loremProduction" is used!
   let production = JOB_TIER_DATA[worker.tier - 1].loremProduction;

   if (worker.name === "Intern")  {
      if (hasUpgrade("Disciplinary Techniques")) {
         const nonInternCount = getNonInternWorkerCount();
         production += 0.01 * nonInternCount;
      }

      if (hasUpgrade("Intern Motivation")) {
         production *= 1 + Game.misc.internMotivation / 100;
      }
   }

   production += workerProductionBonuses.additive;
   production += individualWorkerProductionBonuses[worker.id].additiveBonus;

   production *= workerProductionBonuses.multiplicative;
   production *= individualWorkerProductionBonuses[worker.id].multiplicativeBonus;
   
   if (hasJob("Employee")) {
      production *= 1.5;
   }

   if (worker.name === "Intern" && hasJob("Manager")) {
      production *= 2;
   }

   if (hasUpgrade("Micro Management")) {
      const subordinateCount = getSubordinateCount(worker);
      if (subordinateCount > 0) {
         production *= 1 + 0.1 * subordinateCount;
      }
   }

   return production;
}

export function calculateWorkerProduction(): number {
   let totalProduction = 0;
   for (let i = 0; i < JOB_DATA.length; i++) {
      const worker = JOB_DATA[i];
      const count = Game.userInfo.workers[worker.id];

      const production = getSingularWorkerProduction(worker) * count;
      totalProduction += production;
   }
   return totalProduction;
}


/**
 * Calculates the cost of a specified number of workers.
 * @param worker The worker
 * @param startCount The amount of workers to start at. If not specified, will begin at the current number of workers.
 * @param amount The number of additional workers
 * @returns The total cost of the range of workers
 */
export function calculateWorkerCost(worker: JobInfo, start?: number, amount?: number): number {
   const startN = typeof start !== "undefined" ? start : Game.userInfo.workers[worker.id];
   const amountN = typeof amount !== "undefined" ? amount : 1;


   // Fun fact: This is the only place where the "baseCost" property is used.
   const baseCost = JOB_TIER_DATA[worker.tier - 1].baseCost;
   const count = Game.userInfo.workers[worker.id] + (amount || 0);

   let cost = baseCost * Math.pow(1.1, count);
   const cost2 = baseCost * amountN * Math.pow(1.1, startN + amountN);
   if (cost2 === Infinity) {
      console.trace();
      throw new Error("bad!");
   }
   return cost2;
   console.log(cost, cost2);
   console.log(baseCost, startN, amountN);
   console.log("-=-=--=-=-=-=-=-");

   if (hasJob("Manager")) {
      cost *= 0.9;
   }

   return cost;
}

const calculateAffordAmount = (worker: JobInfo): number => {
   let affordAmount = 0;

   let totalCost = 0;
   for (let i = 0; ; i++) {
      const cost = calculateWorkerCost(worker, i);

      if (totalCost + cost > Game.lorem) {
         break;
      }
      affordAmount++;
      totalCost += cost;
   }
   return affordAmount;
}

const WorkerSection = ({ job: worker }: SectionProps) => {
   const [workerCount, setWorkerCount] = useState(Game.userInfo.workers[worker.id]);
   const [lorem, setLorem] = useState(Game.lorem);

   // For some reason if this isn't here, the default state of workerCount is 1... regardless of the value of Game.userInfo.workers[job.id]
   useEffect(() => {
      const updateLorem = (): void => {
         if (lorem !== Game.lorem) setLorem(Game.lorem);
      }

      Game.createRenderListener(updateLorem);

      setWorkerCount(Game.userInfo.workers[worker.id]);

      return () => {
         Game.removeRenderListener(updateLorem);
      }
   }, [worker.id, lorem]);

   const singleWorkerProduction = getSingularWorkerProduction(worker);
   const totalProduction = singleWorkerProduction * workerCount;
   
   const singleCost = calculateWorkerCost(worker);
   const affordAmount = calculateAffordAmount(worker);
   
   const buyWorker = (num: number): void => {
      for (let i = 0; i < num; i++) {
         const cost = calculateWorkerCost(worker, i);
         
         Game.lorem -= cost;
      }

      Game.userInfo.workers[worker.id] += num;

      updateUnlockedWorkerUpgrades();
   }

   const buySingularWorker = () => {
      buyWorker(1);
   }

   const buyMaxWorker = () => {
      buyWorker(affordAmount);
   }

   return <div>
      <h2>Overview</h2>

      <p>You currently have {workerCount} {worker.name}{workerCount === 1 ? "" : "s"}, producing {roundNum(totalProduction)} lorem every second.</p>
      <p>Each {worker.name} produces {roundNum(singleWorkerProduction)} lorem every second.</p>

      <h2>Description</h2>

      <p>{worker.description}</p>

      <div className="separator"></div>

      <h2>Market</h2>

      <p>Purchase {worker.name}{workerCount === 1 ? "" : "s"} to increase your Lorem production.</p>
      <p>Costs <b>{roundNum(singleCost)}</b> lorem.</p>

      <div className="button-container">
         <Button isDark={affordAmount < 1} onClick={affordAmount > 0 ? buySingularWorker : undefined}>Buy</Button>
         <Button isDark={affordAmount < 1} onClick={affordAmount > 0 ? buyMaxWorker : undefined}><>Buy max ({affordAmount})</></Button>
      </div>
   </div>
}


enum SectionCategories {
   general = "General",
   workers = "Workers"
}

export interface SectionType {
   name: string;
   type: "regular" | "custom";
   category: SectionCategories;
   shouldShow?: () => boolean;
   getSection: (job: JobInfo, promoteFunc?: () => void) => JSX.Element;
   tooltipContent?: (job: JobInfo) => JSX.Element;
}
export const sectionData: ReadonlyArray<SectionType> = [
   {
      name: "Profile",
      type: "regular",
      category: SectionCategories.general,
      getSection: (job: JobInfo, promoteFunc?: () => void) => <ProfileSection job={job} promoteFunc={promoteFunc} />,
      tooltipContent: (job: JobInfo) => {
         const jobRequirements = JOB_TIER_DATA[job.tier - 1].loremRequirements;
         const nextJobRequirements: number | null = job.tier < JOB_TIER_DATA.length ? JOB_TIER_DATA[job.tier].loremRequirements : null;

         return <>
            <h3>Profile</h3>
            <p>You are currently {getPrefix(job.name)} {job.name}.</p>
            {nextJobRequirements !== null ? (
               <p>You are {roundNum((Game.stats.totalLoremGenerated - jobRequirements) / (nextJobRequirements - jobRequirements) * 100)}% of the way to a promotion.</p>
            ) : undefined}
         </>;
      }
   },
   {
      name: "Upgrades",
      type: "custom",
      category: SectionCategories.general,
      getSection: (job: JobInfo) => <UpgradeSection job={job} />
   },
   {
      name: "Career Path",
      type: "regular",
      category: SectionCategories.general,
      shouldShow: () => {
         return Game.userInfo.job.tier >= 3;
      },
      getSection: () => <CareerPathSection />
   },
   ...JOB_DATA.map(currentJob => {
      return {
         name: currentJob.name + "s",
         type: "regular",
         category: SectionCategories.workers,
         shouldShow: () => {
            return Game.userInfo.previousJobs.includes(currentJob) && currentJob.tier < Game.userInfo.job.tier;
         },
         getSection: () => <WorkerSection job={currentJob} />,
         tooltipContent: () => {
            const count = Game.userInfo.workers[currentJob.id];
            const production = getSingularWorkerProduction(currentJob) * count;

            return <>
               <h3>{currentJob.name}s</h3>
      
               <p>You have {Game.userInfo.workers[currentJob.id]} {currentJob.name}s producing {roundNum(production)} lorem every second.</p>
            </>; 
         }
      } as SectionType;
   })
];

enum State {
   regular,
   promoting
}
const CorporateOverview = () => {
   const [currentSection, setCurrentSection] = useState<SectionType>(sectionData[0]);
   const [job, setJob] = useState(Game.userInfo.job);
   const [state, setState] = useState(State.regular);

   useEffect(() => {
      setJob(Game.userInfo.job);
   }, []);

   const changeSection = (newSection: SectionType): void => {
      setCurrentSection(newSection);
   }

   const promote = (job: JobInfo) => {
      Game.userInfo.job = job;
      Game.userInfo.previousJobs.push(job);

      setState(State.regular);
      setJob(job);

      Game.isInFocus = false;
      Game.hideMask();
      Game.unblurScreen();
   }

   const showPromotionScreen = (): void => {
      setState(State.promoting);

      Game.isInFocus = true;
      Game.showMask();
      Game.blurScreen();
   }
   
   let section!: JSX.Element;
   if (currentSection.type === "regular") {
      section = <div className="section">
         <div className="title-bar">{currentSection.name}</div>

         {currentSection.getSection(job, showPromotionScreen)}
      </div>;
   } else if (currentSection.type === "custom") {
      section = currentSection.getSection(job, showPromotionScreen);
   }

   let content!: JSX.Element;
   switch (state) {
      case State.regular: {
         content = <div className="formatter">
            <ControlPanel job={job} currentSection={currentSection} changeSectionFunc={changeSection} />
            
            <div className="content">
               {section}
            </div>
         </div>
         break;
      }
      case State.promoting: {
         content = <PromotionScreen job={job} promoteFunc={promote} />
         break;
      }
   }

   return <div id="corporate-overview" className="view">
      {content}
   </div>
}

export default CorporateOverview;