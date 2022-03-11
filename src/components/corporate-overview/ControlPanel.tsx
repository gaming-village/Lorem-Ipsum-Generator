import Button from "../Button";

import { JobInfo } from "../../data/job-data";
import { sectionData, SectionType } from "./CorporateOverview";

enum SectionCategories {
   general = "General",
   workers = "Workers"
}

interface ControlPanelProps {
   job: JobInfo;
   currentSection: SectionType;
   changeSectionFunc: (newSection: SectionType) => void;
}
const ControlPanel = ({ job, currentSection, changeSectionFunc }: ControlPanelProps) => {
   let key = 0;
   let content = new Array<JSX.Element>();

   const filteredSections = Object.values(SectionCategories).reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue]: new Array<SectionType>() };
   }, {}) as { [key: string]: Array<SectionType> };

   for (const section of sectionData) {
      filteredSections[section.category].push(section);
   }


   for (let i = 0; i < Object.keys(filteredSections).length; i++) {
      const [categoryName, categorySections] = Object.entries(filteredSections)[i];

      const sectionShowInfo = new Array<boolean>(categorySections.length);
      let allIsHidden = true;
      for (let j = 0; j < categorySections.length; j++) {
         const section = categorySections[j];
         
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

      for (let j = 0; j < categorySections.length; j++) {
         const section = categorySections[j];
         if (!sectionShowInfo[j]) {
            continue;
         }

         let button!: JSX.Element;
         if (typeof section.tooltipContent === "undefined") {
            button = <Button onClick={() => changeSectionFunc(section)} className={section === currentSection ? "" : "dark"} key={key++}>{section.name}</Button>;
         } else {
            const tooltip = () => section.tooltipContent!(job);
            button = <Button tooltipContent={tooltip} onClick={() => changeSectionFunc(section)} className={section === currentSection ? "" : "dark"} key={key++}>{section.name}</Button>;
         }

         content.push(button);
      }
   }

   return <div className="control-panel">
      <h1>Control Panel</h1>

      {content}
   </div>;
}

export default ControlPanel;