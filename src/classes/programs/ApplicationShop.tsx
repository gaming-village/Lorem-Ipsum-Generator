import { useState } from "react";
import Button from "../../components/Button";
import { ApplicationCategories } from "../../data/application-data";
import Game from "../../Game";
import Application from "../applications/Application";
import Program from "./Program";

interface ApplicationTabProps {
   application: Application;
   buyFunc: (application: Application) => void;
}
const ApplicationTab = ({application, buyFunc }: ApplicationTabProps): JSX.Element => {
   const info = application.info;

   let imgSrc;
   try {
      imgSrc = require("../../images/application-icons/" + info.iconSrc).default;
   } catch {
      imgSrc = require("../../images/icons/questionmark.png").default;
   }

   return <div className={`tab${info.isUnlocked ? " unlocked" : ""}`}>
      <div className="formatter">
         <div className="formatter">
            <img src={imgSrc} alt="Application icon preview" />
            <div>
               <p className="name">{info.name}</p>
               <p className="description">{info.description}</p>
            </div>
         </div>

         <Button onClick={() => buyFunc(application)} isDark={info.isUnlocked}>{!info.isUnlocked ? info.cost + " Lorem" : "Bought"}</Button>
      </div>
   </div>;
}

const Elem = (): JSX.Element => {
   const [applications, setApplications] = useState<Array<Application>>(Object.values(Game.applications));

   const buyApplication = (application: Application): void => {
      if (!application.info.isUnlocked && Game.lorem >= application.info.cost) {
         Game.lorem -= application.info.cost;
         application.unlock();
      }

      setApplications(Object.values(Game.applications));
   }

   // Create the category container
   const categories = Object.values(ApplicationCategories).reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue]: new Array<Application>() };
   }, {}) as { [key: string]: Array<Application> };

   // Fill the category container
   for (const application of applications) {
      categories[application.info.category].push(application);
   }

   const applicationElems = new Array<JSX.Element>();
   for (const [categoryName, categoryApplications] of Object.entries(categories)) {
      // Create the header
      applicationElems.push(
         <h2 key={applicationElems.length}>{categoryName}</h2>
      );

      for (const application of categoryApplications) {
         applicationElems.push(
            <ApplicationTab application={application} buyFunc={buyApplication} key={applicationElems.length} />
         );
      }
   }

   return <>
      <p>Purchase applications to enchance your productivity here at Lorem Corp.</p>

      {applicationElems}
   </>;
}

class ApplicationShop extends Program {
   constructor() {
      super({
         name: "Application Shop",
         id: "applicationShop",
         fileName: "application_shop"
      });
   }

   protected instantiate(): JSX.Element {
      return <Elem />;
   }
}

export default ApplicationShop;