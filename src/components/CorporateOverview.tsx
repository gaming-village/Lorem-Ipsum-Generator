import React, { useEffect, useState } from "react";
import "../css/corporate-overview.css";
import { JOB_DATA, JOB_TIER_DATA, Job } from "../data/job-data";
import Game from "../Game";
import { audioSources, getPrefix, randItem, roundNum } from "../utils";
import Button from "./Button";
import ProgressBar from "./ProgressBar";

const getJobsByTier = (tier: number): ReadonlyArray<Job> => {
   let jobs = new Array<Job>();
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier === tier) {
         jobs.push(currentJob);
      } else if (currentJob.tier > tier) break;
   }
   return jobs;
}

const getJobHistory = (): ReadonlyArray<Job> => {
   let jobHistory = new Array<Job>();
   const jobPath = Game.userInfo.jobPath.split("").reverse();
   let i = -1;
   let currentTier = 1;
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier !== currentTier) {
         if (currentJob.tier > jobPath.length) break;
         i = 0;
      } else {
         i++;
      }
      const idx = Number(jobPath[currentJob.tier - 1]);
      if (i === idx) {
         jobHistory.push(currentJob);
      }
      currentTier = currentJob.tier;
   }
   return jobHistory;
}

export function getRandomWorker(): Job {
   const potentialWorkers = new Array<Job>();
   const chosenJobIndexes = Game.userInfo.jobPath.split("");
   let idx = 0;
   for (const job of JOB_DATA) {
      if (job.tier > idx) {
         idx = 0;
      } else {
         idx++;
      }
      const chosenJobIdx = Number(chosenJobIndexes[job.tier]);
      if (idx === chosenJobIdx) {
         potentialWorkers.push(job)
      }
   }
   return randItem(potentialWorkers);
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
   const nextJobRequirements = JOB_TIER_DATA[job.tier].requirements;
   const canPromote = totalLoremTyped > nextJobRequirements;
   
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

      <p>You are currently {getPrefix(job.name)} {job.name}.</p>

      <p className="promotion-progress">{roundNum(totalLoremTyped)} / {nextJobRequirements}</p>

      <ProgressBar progress={totalLoremTyped} start={currentJobRequirements} end={nextJobRequirements} />

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
   </>;
}

const UpgradesSection = () => {
   return <>
      
   </>;
}

interface CareerPathNode {
   status: "previousJob" | "nonSelected" | "unknown";
   job: Job;
   children: Array<CareerPathNode>
}
const CareerPathSection = ({}: SectionProps) => {
   const jobHistory = getJobHistory();

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
   let i = 0;
   while (true) {
      if (typeof currentNode === "undefined" || currentNode.children.length === 0) {
         break;
      }

      const rowStyle = {
         "--offset": Math.max(offset, 0)
      } as React.CSSProperties;
      
      let nextNode!: CareerPathNode;
      const newRow = new Array<JSX.Element>();
      for (let j = 0; j < currentNode.children.length; j++) {
         const child = currentNode.children[j];

         if (i > 0 && child.status === "previousJob") {
            console.log(i);
            if (j === 0) {
               console.log("- offset");
               offset--;
            } else {
               offset++;
               console.log("+ offset");
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
      i++;
   }

   return <div id="career-path">
      {tree}
   </div>
}

export function calculateWorkerProduction(): number {
   let totalProduction = 0;
   for (let i = 0; i < JOB_DATA.length; i++) {
      const worker = JOB_DATA[i];
      const count = Game.userInfo.workers[worker.id];
      totalProduction += worker.loremProduction * count;
   }
   return totalProduction;
}

const calculateWorkerCost = (initialCost: number, workerCount: number): number => {
   return initialCost * Math.pow(1.3, workerCount);
}

const WorkerSection = ({ job }: SectionProps) => {
   const [workerCount, setWorkerCount] = useState(Game.userInfo.workers[job.id]);

   // For some reason if this isn't here, the default state of workerCount is 1... regardless of the value of Game.userInfo.workers[job.id]
   useEffect(() => {
      setWorkerCount(Game.userInfo.workers[job.id]);
   }, [job.id]);

   const loremProduction = workerCount * job.loremProduction;

   const initialCost = JOB_TIER_DATA[job.tier - 1].initialCost;
   const cost = calculateWorkerCost(initialCost, workerCount);
   
   const buyWorker = (): boolean => {
      const initialCost = JOB_TIER_DATA[job.tier - 1].initialCost;
      const cost = calculateWorkerCost(initialCost, Game.userInfo.workers[job.id]);

      if (Game.lorem >= cost) {
         Game.lorem -= cost;

         Game.userInfo.workers[job.id]++;
         return true;
      }
      return false;
   }

   const buySingularWorker = () => {
      if (buyWorker()) {
         setWorkerCount(Game.userInfo.workers[job.id]);
      };
   }

   const buyMaxWorker = () => {
      while (buyWorker()) {
         setWorkerCount(Game.userInfo.workers[job.id]);
      };
   }

   return <div>
      <h2>Overview</h2>

      <p>You currently have {workerCount} {job.name}{workerCount === 1 ? "" : "s"}, producing {loremProduction} lorem every second.</p>

      <p>Each {job.name} produces {job.loremProduction} lorem every second.</p>

      <div className="separator"></div>

      <h2>Market</h2>

      <p>Purchase {job.name}{workerCount === 1 ? "" : "s"} to increase your Lorem production.</p>

      <p>Costs <b>{roundNum(cost)}</b> lorem.</p>

      <div className="button-container">
         <Button onClick={buySingularWorker}>Buy</Button>
         <Button onClick={buyMaxWorker}>Buy max</Button>
      </div>
   </div>
}


enum SectionCategories {
   general = "General",
   workers = "Workers"
}

interface SectionType {
   name: string;
   type: "regular"| "custom";
   category: SectionCategories;
   isOpened: boolean;
   shouldShow?: () => boolean;
   getSection: (job: Job, promoteFunc?: () => void) => JSX.Element;
}
let sectionData: ReadonlyArray<SectionType> = [
   {
      name: "Profile",
      type: "regular",
      category: SectionCategories.general,
      isOpened: true,
      getSection: (job: Job, promoteFunc?: () => void) => <ProfileSection job={job} promoteFunc={promoteFunc} />
   },
   {
      name: "Upgrades",
      type: "custom",
      category: SectionCategories.general,
      isOpened: false,
      getSection: () => <UpgradesSection />
   },
   {
      name: "Career Path",
      type: "regular",
      category: SectionCategories.general,
      isOpened: false,
      getSection: (job: Job) => <CareerPathSection job={job} />
   }
];
sectionData = sectionData.concat(JOB_DATA.map(currentJob => {
   return {
      name: currentJob.name + "s",
      type: "regular",
      category: SectionCategories.workers,
      isOpened: false,
      shouldShow: () => {
         const jobHistory = getJobHistory();
         return jobHistory.includes(currentJob);
      },
      getSection: () => <WorkerSection job={currentJob} />
   } as SectionType;
}));

const getControlPanel = (job: Job, sections: Array<SectionType>, changeSection: (newSection: SectionType) => void): Array<JSX.Element> => {
   let key = 0;
   let content = new Array<JSX.Element>();

   const filteredSections = Object.values(SectionCategories).reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue]: new Array<SectionType>() };
   }, {}) as { [key: string]: Array<SectionType> };

   for (const section of sections) {
      filteredSections[section.category].push(section);
   }


   for (let i = 0; i < Object.keys(filteredSections).length; i++) {
      const [categoryName, sections] = Object.entries(filteredSections)[i];

      const sectionShowInfo = new Array<boolean>(sections.length);
      let allIsHidden = true;
      for (let j = 0; j < sections.length; j++) {
         const section = sections[j];
         
         sectionShowInfo[j] = section.shouldShow ? section.shouldShow() : true;
         if (sectionShowInfo[j]) allIsHidden = false;
      }

      if (allIsHidden) continue;

      // Add a separator between sections
      if (i > 0) {
         content.push(
            <div key={key++} className="separator"></div>
         );
      }

      content.push(
         <h2 key={key++}>{categoryName}</h2>
      );

      for (let j = 0; j < sections.length; j++) {
         const section = sections[j];
         if (!sectionShowInfo[j]) {
            continue;
         }
         content.push(
            <Button onClick={() => changeSection(section)} className={section.isOpened ? "" : "dark"} key={key++}>{section.name}</Button>
         );
      }
   }

   return content;
}

const playPromotionAnimation = (): Promise<void> => {
   const animation = document.createElement("div");
   animation.id = "promotion-animation";
   document.body.appendChild(animation);

   audioSources["win95-startup"].play();

   const ENTRANCE_DURATION = 1400;
   const EXIT_DURATION = 600;

   return new Promise(resolve => {
      setTimeout(() => {
         resolve();

         setTimeout(() => {
            animation.remove();
         }, EXIT_DURATION);
      }, ENTRANCE_DURATION);
   });
}

interface PromotionScreenProps {
   job: Job;
   promote: (newJob: Job) => void;
}
const PromotionScreen = ({ job, promote }: PromotionScreenProps) => {
   let nextJobs = new Array<Job>();
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier < job.tier + 1 || (currentJob.requirement && currentJob.requirement !== job.name)) continue;
      if (currentJob.tier > job.tier + 1) break;

      nextJobs.push(currentJob);
   }

   const [selectedJob, setSelectedJob] = useState<Job | null>(nextJobs.length !== 1 ? null : nextJobs[0]);

   const switchSelectedJob = (newJob: Job) => {
      setSelectedJob(newJob);
   }

   const careerPanels = nextJobs.map((currentJob, i) => {
      return <div onClick={() => switchSelectedJob(currentJob)} className={`career-panel${currentJob === selectedJob ? " selected" : ""}`} key={i}>
         <h3>{currentJob.name}</h3>
         <div className="salary">Salary: {currentJob.salary}</div>

         <ul>
            {currentJob.benefits.map((benefit, j) => {
               return <li key={j}>{benefit}</li>
            })}
         </ul>
      </div>
   });

   const promotionBenefitData = JOB_TIER_DATA[job.tier].benefits;
   const promotionBenefits = <ul>
      {promotionBenefitData.map((benefit, i) => {
         return <li key={i}>{benefit}</li>
      })}
   </ul>;

   const promotionAttempt = async (job: Job | null) => {
      if (job !== null) {
         await playPromotionAnimation();

         promote(job);
      }
   }

   return <div id="promotion-screen" className={nextJobs.length === 1 ? "single-option" : ""}>
      <h1>You've been promoted!</h1>

      {nextJobs.length === 1 ? <>
         <p>New job:</p>

         {promotionBenefits}

         <div className="career-path-container">
            {careerPanels}
         </div>

         <Button onClick={() => promotionAttempt(nextJobs[0])} isCentered={true} isFlashing={true}>Continue</Button>
      </> : <>
         <p>Choose your career path:</p>

         {promotionBenefits}

         <div className="career-path-container">
            {careerPanels}
         </div>

         <p className="selected-label">Selected: <b>{selectedJob ? selectedJob.name : "None"}</b></p>

         <Button isDark={selectedJob === null} isFlashing={selectedJob !== null} isCentered={true} onClick={() => promotionAttempt(selectedJob)}>Continue</Button>
      </>}

      <div className="footer">LoremCorp LLC&trade;</div>
   </div>;
}

export let updateCorporateOverview: (() => void) | null = null;

const CorporateOverview = () => {
   const [sections, setSections] = useState<Array<SectionType>>(sectionData.slice());
   const [job, setJob] = useState(Game.userInfo.job);
   const [isPromoting, setIsPromoting] = useState(false);

   useEffect(() => {
      updateCorporateOverview = () => {
         setJob(Game.userInfo.job);
      };
   });

   let openedSection!: SectionType;
   for (const section of sections) {
      if (section.isOpened) {
         openedSection = section;
         break;
      }
   }

   const changeSection = (newSection: SectionType): void => {
      const newSectionArr = sections.slice();
      for (const section of newSectionArr) {
         section.isOpened = section === newSection;
      }
      setSections(newSectionArr);
   }

   const promote = (job: Job) => {
      setIsPromoting(false);
      setJob(job);

      let tierIndex = 0;
      for (const currentJob of JOB_DATA) {
         if (currentJob.tier === job.tier) {
            if (currentJob === job) {
               break;
            }
            tierIndex++;
         }
      }

      Game.userInfo.job = job;
      Game.userInfo.jobPath = tierIndex + Game.userInfo.jobPath;

      Game.isInFocus = false;
      Game.hideMask();
      Game.unblurScreen();
   }

   const showPromotionScreen = (): void => {
      setIsPromoting(true);
      Game.isInFocus = true;
      Game.showMask();
      Game.blurScreen();
   }

   const controlPanel = getControlPanel(job, sections, changeSection);
   
   let section!: JSX.Element;
   if (openedSection.type === "regular") {
      section = <div className="section">
         <div className="title-bar">{openedSection.name}</div>

         {openedSection.getSection(job, showPromotionScreen)}
      </div>;
   } else if (openedSection.type === "custom") {
      section = openedSection.getSection(job, showPromotionScreen);
   }

   const main = isPromoting ? <>
      <PromotionScreen job={job} promote={promote} />
   </> : <>
      <div className="formatter">
         <div className="control-panel">
            <h1>Control Panel</h1>

            {controlPanel}
         </div>
         <div className="content">
            {section}
         </div>
      </div>
   </>

   return <div id="corporate-overview" className="view">
      {main}
   </div>
}

export default CorporateOverview;