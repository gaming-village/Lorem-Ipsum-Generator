import React, { useEffect, useState } from "react";
import "../css/corporate-overview.css";
import { JOB_DATA, Job } from "../data/corporate-overview-data";
import Game from "../Game";
import { getPrefix, roundNum } from "../utils";
import Button from "./Button";
import ProgressBar from "./ProgressBar";

interface SectionProps {
   job: Job;
   promoteFunc?: () => void
}

const ProfileSection = ({ job, promoteFunc }: SectionProps) => {
   const nextJob = JOB_DATA[JOB_DATA.indexOf(job) + 1];
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

   const canPromote = totalLoremTyped > nextJob.requirements.lorem;
   
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

      <p>You are currently {getPrefix(job.name)} {job.name}. Your next position is as {getPrefix(nextJob.name)} {nextJob.name}.</p>

      <p className="promotion-progress">{roundNum(totalLoremTyped)} / {nextJob.requirements.lorem}</p>

      <ProgressBar progress={totalLoremTyped} start={job.requirements.lorem} end={nextJob.requirements.lorem} />

      <div className="progress-bar-formatter">
         <div>
            <h3>{job.name}</h3>
            <p>{job.requirements.lorem} lorem generated</p>
         </div>
         <div>
            <h3>{nextJob.name}</h3>
            <p>{nextJob.requirements.lorem} lorem generated</p>
         </div>
      </div>

      <Button isDark={!canPromote} isFlashing={canPromote} isCentered={true} onClick={promote}>Promote</Button>
   </>;
}

const UpgradesSection = ({ job }: SectionProps) => {
   return <div>

   </div>;
}

enum SectionCategories {
   general = "General"
}

interface SectionType {
   name: string;
   type: "regular"| "custom";
   category: SectionCategories;
   isOpened: boolean;
   getSection: (job: Job, promoteFunc?: () => void) => JSX.Element;
}
const DEFAULT_SECTIONS: ReadonlyArray<SectionType> = [
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

const getControlPanel = (sections: Array<SectionType>, changeSection: (newSection: SectionType) => void): Array<JSX.Element> => {
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

      content.push(
         <h2 key={key++}>{categoryName}</h2>
      );

      for (const section of sections) {
         content.push(
            <Button onClick={() => changeSection(section)} className={section.isOpened ? "" : "dark"} key={key++}>{section.name}</Button>
         );
      }

      // Add a separator between sections
      if (i < Object.keys(filteredSections).length - 1) {
         content.push(
            <div key={key++} className="separator"></div>
         );
      }
   }

   return content;
}

const CorporateOverview = () => {
   const [sections, setSections] = useState<Array<SectionType>>(DEFAULT_SECTIONS.slice());
   const [job, setJob] = useState(JOB_DATA[0]);

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
      setJob(JOB_DATA[JOB_DATA.indexOf(job) + 1]);
   }

   const controlPanel = getControlPanel(sections, changeSection);
   
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