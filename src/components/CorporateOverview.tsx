import React, { useEffect, useState } from "react";
import "../css/corporate-overview.css";
import { JOB_DATA, Job, JOB_REQUIREMENTS } from "../data/corporate-overview-data";
import Game from "../Game";
import { getPrefix, randItem, roundNum } from "../utils";
import Button from "./Button";
import ProgressBar from "./ProgressBar";

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
   
   const nextJobRequirements = JOB_REQUIREMENTS[JOB_DATA.indexOf(job) + 1];
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

      <ProgressBar progress={totalLoremTyped} start={JOB_REQUIREMENTS[job.tier]} end={nextJobRequirements} />

      <div className="progress-bar-formatter">
         <div>
            <h3>{job.name}</h3>
            <p>{JOB_REQUIREMENTS[job.tier]} lorem generated</p>
         </div>
         <div>
            <h3>???</h3>
            <p>{nextJobRequirements} lorem generated</p>
         </div>
      </div>

      <Button isDark={!canPromote} isFlashing={canPromote} isCentered={true} onClick={() => promote()}>Promote</Button>
   </>;
}

const UpgradesSection = ({ job }: SectionProps) => {
   return <div>
      
   </div>;
}

const WorkerSection = ({ job }: SectionProps) => {
   const jobIndex = JOB_DATA.indexOf(job);

   const workerCount = Game.userInfo.workers[jobIndex];
   const loremProduction = workerCount * job.loremProduction;

   return <div>
      <h2>Overview</h2>

      <p>You currently have {workerCount} {job.name}{workerCount === 1 ? "" : "s"}, producing {loremProduction} lorem every second.</p>

      <p>Each {job.name} produces {job.loremProduction} lorem every second.</p>

      <div className="separator"></div>

      <h2>Market</h2>

      <div className="button-container">
         <Button>Buy</Button>
         <Button>Buy max</Button>
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
   shouldShow?: (job: Job) => boolean;
   getSection: (job: Job, promoteFunc?: () => void) => JSX.Element;
}
let DEFAULT_SECTIONS: ReadonlyArray<SectionType> = [
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
      getSection: (job: Job) => <UpgradesSection job={job} />
   }
];
DEFAULT_SECTIONS = DEFAULT_SECTIONS.concat(JOB_DATA.map(currentJob => {
   return {
      name: currentJob.name + "s",
      type: "regular",
      category: SectionCategories.workers,
      isOpened: false,
      shouldShow: (job: Job) => {
         return currentJob.tier < job.tier;
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
         
         sectionShowInfo[j] = section.shouldShow ? section.shouldShow(job) : true;
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

const CorporateOverview = () => {
   const [sections, setSections] = useState<Array<SectionType>>(DEFAULT_SECTIONS.slice());
   const [job, setJob] = useState(JOB_DATA[0]);
   const [isPromoting, setIsPromoting] = useState(false);

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

   const promote = (): void => {
      setIsPromoting(true);

      // setJob(JOB_DATA[JOB_DATA.indexOf(job) + 1]);
   }

   const controlPanel = getControlPanel(job, sections, changeSection);
   
   let section!: JSX.Element;
   if (openedSection.type === "regular") {
      section = <div className="section">
         <div className="title-bar">{openedSection.name}</div>

         {openedSection.getSection(job, promote)}
      </div>;
   } else if (openedSection.type === "custom") {
      section = openedSection.getSection(job, promote);
   }

   return <div id="corporate-overview" className="view">
      <div className="formatter">
         <div className="control-panel">
            <h1>Control Panel</h1>

            {controlPanel}
         </div>
         <div className="content">
            {section}
         </div>
      </div>
   </div>;
}

export default CorporateOverview;