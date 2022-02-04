import { useState } from "react";
import Game from "../../Game";
import Program from "./Program";

const Elem = (): JSX.Element => {
   const [applications, setApplications] = useState<Array<any>>(Object.values(Game.applications));

   const update = () => {
      setApplications(Object.values(Game.applications));
   }

   const applicationTabs: ReadonlyArray<JSX.Element> = applications.map((application, i) => {
      let imgSrc;
      try {
         imgSrc = require("../../images/application-icons/" + application.iconSrc).default;
      } catch {
         imgSrc = require("../../images/icons/questionmark.png").default;
      }

      const buy = (): void => {
         if (!application.isUnlocked && Game.lorem > application.cost) {
            Game.lorem -= application.cost;
            application.unlock();
         }

         update();
      }

      return <div className={`tab ${application.isUnlocked ? "unlocked" : ""}`} key={i}>
         <div className="formatter">
            <div className="formatter">
               <img src={imgSrc} alt="Application icon preview" />
               <div>
                  <p className="name">{application.name}</p>
                  <p className="description">{application.description}</p>
               </div>
            </div>
            <button onClick={buy} className={`button ${application.isUnlocked ? "dark" : ""}`}>{!application.isUnlocked ? application.cost + " Lorem" : "Bought"}</button>
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
         id: "applicationShop"
      });
   }

   protected instantiate(): JSX.Element {
      return <Elem />;
   }
}

export default ApplicationShop;