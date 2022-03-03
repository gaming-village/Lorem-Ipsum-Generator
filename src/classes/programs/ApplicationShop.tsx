import { useState } from "react";
import Game from "../../Game";
import Application from "../applications/Application";
import Program from "./Program";

const Elem = (): JSX.Element => {
   const [applications, setApplications] = useState<Array<any>>(Object.values(Game.applications));

   const update = () => {
      setApplications(Object.values(Game.applications));
   }

   const applicationTabs: ReadonlyArray<JSX.Element> = applications.map((application: Application, i) => {
      const info = application.info;

      let imgSrc;
      try {
         imgSrc = require("../../images/application-icons/" + info.iconSrc).default;
      } catch {
         imgSrc = require("../../images/icons/questionmark.png").default;
      }

      const buy = (): void => {
         if (!info.isUnlocked && Game.lorem > info.cost) {
            Game.lorem -= info.cost;
            application.unlock();
         }

         update();
      }

      return <div className={`tab ${info.isUnlocked ? "unlocked" : ""}`} key={i}>
         <div className="formatter">
            <div className="formatter">
               <img src={imgSrc} alt="Application icon preview" />
               <div>
                  <p className="name">{info.name}</p>
                  <p className="description">{info.description}</p>
               </div>
            </div>
            <button onClick={buy} className={`button ${info.isUnlocked ? "dark" : ""}`}>{!info.isUnlocked ? info.cost + " Lorem" : "Bought"}</button>
         </div>
      </div>
   });

   return <>
      <p>Purchase applications to enchance your productivity here at Lorem Corp.</p>

      {applicationTabs}
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