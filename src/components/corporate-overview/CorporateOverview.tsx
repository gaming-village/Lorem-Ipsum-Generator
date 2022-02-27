import React, { useEffect, useState } from "react";
import { JOB_DATA, JOB_TIER_DATA, Job, UPGRADES, UpgradeInfo } from "../../data/job-data";
import Game from "../../Game";
import { getPrefix, randItem, roundNum } from "../../utils";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import TitleBar from "../TitleBar";

import "../../css/corporate-overview.css";
import PromotionScreen from "./PromotionScreen";
import ControlPanel from "./ControlPanel";

const getJobsByTier = (tier: number): ReadonlyArray<Job> => {
   let jobs = new Array<Job>();
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier === tier) {
         jobs.push(currentJob);
      } else if (currentJob.tier > tier) break;
   }
   return jobs;
}

export function getRandomWorker(): Job {
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
   let job: Job | undefined;
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

interface SectionProps {
   job: Job;
   promoteFunc?: () => void
}

const ProfileSection = ({ job, promoteFunc }: SectionProps) => {
   const [totalLoremTyped, setTotalLoremTyped] = useState(Game.totalLoremTyped);
   
   useEffect(() => {
      const updateTotalLoremTyped = () => {
         setTotalLoremTyped(Game.totalLoremTyped);
      }
      
      Game.createRenderListener(updateTotalLoremTyped);
      
      return () => {
         Game.removeRenderListener(updateTotalLoremTyped);
      }
   });
   
   const currentJobRequirements = JOB_TIER_DATA[job.tier - 1].requirements;
   const nextJobRequirements: number | null = job.tier < JOB_TIER_DATA.length ? JOB_TIER_DATA[job.tier].requirements : null;

   const canPromote = nextJobRequirements !== null ? totalLoremTyped >= nextJobRequirements : false;
   
   const promote = (): void => {
      if (canPromote) promoteFunc!();
   }

   return <>
      <h2>ID Card</h2>

      <div className="id-card">
         <div className="job-occupation">WORKER</div>
         <h3 className="worker-number">#4781347</h3>
         <ul>
            <li>Position: {job.name}</li>
            <li>Salary: {job.salary}</li>
         </ul>
         <div className="footer">LoremCorp LLC&trade;</div>
      </div>

      <h2>Job Status</h2>

      <p>You are currently {getPrefix(job.name)} {job.name}. {nextJobRequirements === null ? "You are at the highest job position current available." : undefined}</p>

      <p className="promotion-progress">
         {nextJobRequirements !== null ? (
            `${roundNum(totalLoremTyped)} / ${nextJobRequirements}`
         ) : (
            "Max job tier!"
         )}
      </p>

      <ProgressBar progress={nextJobRequirements !== null ? totalLoremTyped : currentJobRequirements + 1} start={currentJobRequirements} end={nextJobRequirements !== null ? nextJobRequirements : currentJobRequirements} />

      {nextJobRequirements !== null ? <>
      <div className="progress-bar-formatter">
         <div>
            <h3>{job.name}</h3>
            <p>{currentJobRequirements} lorem generated</p>
         </div>
         <div>
            <h3>???</h3>
            <p>{nextJobRequirements} lorem generated</p>
         </div>
      </div>

      <Button isDark={!canPromote} isFlashing={canPromote} isCentered={true} onClick={() => promote()}>Promote</Button>
      </> : undefined}
   </>;
}

/**
 * Used to find whether the user owns an upgrade or not.
 * @param name The name of the upgrade
 * @returns If the upgrade is owned.
 */
export function hasUpgrade(name: string): boolean {
   for (const upgrade of UPGRADES) {
      if (upgrade.name === name) return upgrade.isBought || false;
   }
   throw new Error(`Upgrade '${name}' does not exist!`);
}

const getUpgradeRequirements = (upgrade: UpgradeInfo): ReadonlyArray<string> => {
   let upgradeRequirements = new Array<string>();
   if (typeof upgrade.requirements.lorem !== "undefined") {
      upgradeRequirements.push(`${upgrade.requirements.lorem} Lorem`);
   }
   if (typeof upgrade.requirements.workers !== "undefined") {
      for (const [workerID, count] of Object.entries(upgrade.requirements.workers)) {
         // Find the corresponding worker
         let worker!: Job;
         for (const currentWorker of JOB_DATA) {
            if (currentWorker.id === workerID) {
               worker = currentWorker;
               break;
            }
         }

         upgradeRequirements.push(`${count} ${worker.name}s`);
      }
   }
   return upgradeRequirements;
}

const canBuyUpgrade = (upgrade: UpgradeInfo, lorem: number): boolean => {
   for (const [type, requirement] of Object.entries(upgrade.requirements)) {
      switch (type) {
         case "lorem": {
            if (lorem < requirement) {
               return false;
            }
            break;
         }
         case "workers": {
            for (const [workerID, workerCount] of Object.entries(requirement)) {
               if (Game.userInfo.workers[workerID] < Number(workerCount)) {
                  return false;
               }
            }
            break;
         }
      }
   }
   return true;
}

const buyUpgrade = (upgrade: UpgradeInfo): void => {
   upgrade.isBought = true;

   if (typeof upgrade.requirements.lorem !== "undefined") {
      Game.lorem -= upgrade.requirements.lorem;
   }
   if (typeof upgrade.requirements.workers !== "undefined") {
      for (const [workerID, workerCount] of Object.entries(upgrade.requirements.workers)) {
         Game.userInfo.workers[workerID] -= workerCount;
      }
   }
}

const UpgradesSection = ({ job }: SectionProps) => {
   const [lorem, setLorem] = useState(Game.lorem);

   useEffect(() => {
      const updateLoremCount = (): void => {
         if (Game.lorem !== lorem) setLorem(Game.lorem);
      }

      Game.createRenderListener(updateLoremCount);

      return () => {
         Game.removeRenderListener(updateLoremCount);
      }
   }, [lorem]);
   
   let content = new Array<JSX.Element>();
   let key = 0;

   let upgradeRow = new Array<JSX.Element>();
   let previousTier = 1;
   for (let i = 0; i < UPGRADES.length; i++) {
      const upgrade = UPGRADES[i];

      if (upgrade.tier > job.tier) {
         if (upgradeRow.length > 0) {
            content.push(
               <div key={key++} className="upgrade-container">
                  {upgradeRow}
               </div>
            );
         }
         break;
      }

      if (upgrade.tier !== previousTier) {
         content.push(
            <div key={key++} className="upgrade-container">
               {upgradeRow}
            </div>
         );

         upgradeRow = new Array<JSX.Element>();
      }

      const upgradeRequirements = getUpgradeRequirements(upgrade);
      const canBuy = canBuyUpgrade(upgrade, lorem);
      const isBought = hasUpgrade(upgrade.name);

      upgradeRow.push(
         <div key={key++} className={`upgrade${isBought ? " bought" : ""}`}>
            <TitleBar title={upgrade.name} uiButtons={[]} isDraggable={false} />
            
            <p className="description">{upgrade.description}</p>

            <div className="requirements">
               {upgradeRequirements.reduce((previousValue, currentValue, i) => {
                  return previousValue + currentValue + (i < upgradeRequirements.length - 1 ? ", " : "");
               }, "")}
            </div>

            <Button onClick={canBuy && !isBought ? () => buyUpgrade(upgrade) : undefined} isFlashing={canBuy && !isBought} isDark={isBought} isCentered={true}>{isBought ? "Bought" : "Purchase"}</Button>
         </div>
      );

      previousTier = upgrade.tier;
   }

   return <div id="upgrades">
      {content}

      {job.tier < JOB_DATA[JOB_DATA.length - 1].tier ? (
         <p className="notice">Get promoted to unlock more upgrades!</p>
      ) : ""}
   </div>;
}

interface CareerPathNode {
   status: "previousJob" | "nonSelected" | "unknown";
   job: Job;
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

         const isInPath = typeof currentJob.requirement === "undefined" || currentJob.requirement === job.name;
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
   let offset = 0;
   for (let i = 0; ; i++) {
      if (typeof currentNode === "undefined" || currentNode.children.length === 0) {
         break;
      }

      const rowStyle = {
         "--offset": offset
      } as React.CSSProperties;
      
      let nextNode!: CareerPathNode;
      const newRow = new Array<JSX.Element>();
      for (let j = 0; j < currentNode.children.length; j++) {
         const child = currentNode.children[j];
         if (i > 0 && currentNode.children.length > 1 && child.status === "previousJob") {
            if (j === 0) {
               offset--;
            } else {
               offset++;
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
      {tree}
   </div>
}

/**
 * Calculates how much one of a certain worker type would produce
 * @param worker The worker
 */
const getSingularWorkerProduction = (worker: Job): number => {
   let production = worker.loremProduction;
   
   if (hasJob("Employee")) {
      production *= 1.5;
   }
   if (worker.name === "Intern" && hasJob("Manager")) {
      production *= 2;
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

const calculateWorkerCost = (worker: Job): number => {
   const initialCost = JOB_TIER_DATA[worker.tier - 1].initialCost;
   const count = Game.userInfo.workers[worker.id];

   let cost = initialCost * Math.pow(1.3, count);

   if (hasJob("Manager")) {
      cost *= 0.9;
   }

   return cost;
}

const calculateAffordAmount = (worker: Job): number => {
   let affordAmount = 0;
   let total = Game.lorem;
   while (true) {
      const cost = calculateWorkerCost(worker);

      if (cost > total) {
         return affordAmount;
      }
      affordAmount++;
      total -= cost;
   }
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
         const cost = calculateWorkerCost(worker);
         
         Game.lorem -= cost;
      }

      Game.userInfo.workers[worker.id] += num;
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
   getSection: (job: Job, promoteFunc?: () => void) => JSX.Element;
   tooltipContent?: (job: Job) => JSX.Element;
}
export const sectionData: ReadonlyArray<SectionType> = [
   {
      name: "Profile",
      type: "regular",
      category: SectionCategories.general,
      getSection: (job: Job, promoteFunc?: () => void) => <ProfileSection job={job} promoteFunc={promoteFunc} />,
      tooltipContent: (job: Job) => {
         const jobRequirements = JOB_TIER_DATA[job.tier - 1].requirements;
         const nextJobRequirements: number | null = job.tier < JOB_TIER_DATA.length ? JOB_TIER_DATA[job.tier].requirements : null;

         return <>
            <h3>Profile</h3>
            <p>You are currently {getPrefix(job.name)} {job.name}.</p>
            {nextJobRequirements !== null ? (
               <p>You are {roundNum((Game.totalLoremTyped - jobRequirements) / (nextJobRequirements - jobRequirements) * 100)}% of the way to a promotion.</p>
            ) : undefined}
         </>;
      }
   },
   {
      name: "Upgrades",
      type: "custom",
      category: SectionCategories.general,
      getSection: (job: Job) => <UpgradesSection job={job} />
   },
   {
      name: "Career Path",
      type: "regular",
      category: SectionCategories.general,
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

   const promote = (job: Job) => {
      Game.userInfo.job = job;
      Game.userInfo.previousJobs.push(job);

      setJob(job);
      setState(State.regular);

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