import React, { useState, useEffect } from "react";
import "../css/corporate-overview.css";
import Button from "./Button";
import CorporatePanel from "./CorporatePanel";
import Program from "./Program";
import { loremCorp, switchJSXPanel } from "../corporate-overview";
import { beautify, getPrefix, roundNum } from "../utils";
import List from "./List";
import ProgressBar from "./ProgressBar";
import WORKERS, { Worker } from "../data/workers";
import { getUpgrades } from "../upgrades";
import { getPackElements } from "../lorem-production";

const CorporateOverview = () => {
   const [job, setJob] = useState(WORKERS[0]);

   // Very bad practice but I have no alternative... I think
   // Used to force a re-render whenever a worker is bought/lorem pack is bought/etc.
   const [, updateState] = React.useState({});
   const forceUpdate = React.useCallback(() => updateState({}), []);

   useEffect(() => {
      loremCorp.addJobListener(() => {
         setJob(loremCorp.job as Worker);
      });
      loremCorp.updateCorporateOverview = () => forceUpdate();
   }, [forceUpdate]);

   const totalLoremProduction: number = loremCorp.getTotalWorkerProduction();

   // Create the worker buttons and panels
   const jobButtons: JSX.Element[] = [];
   const jobPanels: JSX.Element[] = [];
   for (let i = 0; i < loremCorp.jobIndex; i++) {
      const worker = WORKERS[i];

      const workerCount = loremCorp.workers[WORKERS.indexOf(worker)];
      const workerProduction = loremCorp.getWorkerProduction(worker);

      const workerType: string = beautify(worker.name);
      const workerName: string = beautify(worker.name, workerCount);

      const panelName = `${worker.name}-panel`;
      const panel = <CorporatePanel key={i} className={panelName}>
         <>
            <Program className="panel" title={workerType} hasMinimizeButton={false}>
               <>
                  <h2>Overview</h2>

                  <p>You have {workerCount} {workerName} producing {roundNum(workerProduction)} lorem every second.</p>

                  <p>Each {workerType} produces {worker.loremProduction} lorem.</p>
               </>
            </Program>

            <Program className="panel" title="Purchase" hasMinimizeButton={false}>
               <>
                  <h2>Costs</h2>

                  <div className="left">
                     <List>
                        <>
                        {Object.keys(worker.costs).map((costType, i) => {
                           return <li key={i}>{beautify(costType)}</li>
                        })}
                        </>
                     </List>
                  </div>
                  <div className="right">
                     <List hasBulletPoints={false}>
                        <>
                        {Object.values(worker.costs).map((cost, i) => {
                           if (i === 0) {
                              const workerCost = loremCorp.getWorkerCost(worker, workerCount + 1);
                              return <li key={i}>{roundNum(workerCost)}</li>
                           }
                           return <li key={i}>{cost}</li>
                        })}
                        </>
                     </List>
                  </div>

                  <Button onClick={() => loremCorp.attemptToBuyWorker(worker)} text="Buy" isCentered={true} />
               </>
            </Program>
         </>
      </CorporatePanel>
      jobPanels.push(panel);

      const button = <Button onClick={() => switchJSXPanel(worker.name)} key={i} className={`${worker.name}-button dark`} text={workerName} />
      jobButtons.push(button);
   }

   return (
      <div id="corporate-overview" className="view">
         <div className="left-bar">
            <h2>Career Information</h2>
            <p>Position: Intern</p>
            <p>Salary: N/A</p>
            <p id="words-typed">Words typed: 0</p>

            <h2>Main</h2>
            <Button className="home-button dark" text="Home" />
            <Button className="upgrades-button dark" text="Upgrades" />

            <h2>Lorem Packs</h2>
            <Button className="lorem-packs-shop-button dark" text="Shop" />
            <Button className="dictionary-button dark" text="Dictionary" />

            {jobButtons.length > 0 ? <h2>Subordinates</h2> : ""}
            <div className="job-button-container">
               {jobButtons}
            </div>
         </div>

         <div className="right-bar">
            <CorporatePanel className="home-panel">
               <>
                  <Program className="panel" title="Profile" isDraggable={false} hasMinimizeButton={false}>
                     <>
                        <h2>Worker #{loremCorp.workerNumber}</h2>

                        <div className="left">
                           <ul>
                              <li>Position: {beautify(job.name)}</li>
                              <li>Salary: {job.salary}</li>
                           </ul>
                        </div>
                        <div className="right">
                           <div className="profile-picture">
                           </div>
                        </div>
                     </>
                  </Program>

                  <Program className="panel" title="Overview" isDraggable={false} hasMinimizeButton={false}>
                     <>
                        <p>Lorem Production: {roundNum(totalLoremProduction)} per second</p>

                        <h3>Your Workers</h3>

                        {loremCorp.jobIndex > 0 ?
                        <List>
                           <>
                           {WORKERS.reduce((result, currentJob, i) => {
                              if (i < loremCorp.jobIndex) {
                                 const workerCount = loremCorp.workers[WORKERS.indexOf(currentJob)];
                                 const listElem = <li key={i}>{workerCount} {beautify(currentJob.name, workerCount)}</li>;
                                 result.push(listElem);
                              }
                              return result;
                           }, [] as JSX.Element[])}
                           </>
                        </List>
                        :
                        <p>You have no workers.</p>
                        }
                     </>
                  </Program>
                  
                  <Program className="panel" title="Promote" isDraggable={false} hasMinimizeButton={false}>
                     <>
                        {
                        loremCorp.jobIndex < WORKERS.length - 1 ?
                        <>
                           <p>You are currently {getPrefix(job.name) + " " + beautify(job.name)}. Your next position is as {getPrefix(WORKERS[loremCorp.jobIndex + 1].name) + " " + beautify(WORKERS[loremCorp.jobIndex + 1].name)}.</p>
                           <ProgressBar />
                           <Button onClick={() => loremCorp.attemptToPromote()} isCentered={true} text="Promote" />
                        </> :
                        <p>You are {getPrefix(job.name) + " " + beautify(job.name)}.</p>
                        }
                     </>
                  </Program>
               </>
            </CorporatePanel>

            <CorporatePanel className="upgrades-panel">
               <>
                  <Program className="panel" title="Upgrades" hasMinimizeButton={false}>
                     <>
                        <h2>Information</h2>

                        <p>Sacrifice your workers and precious lorem in exchange for powerful boosts.</p>

                        <p>More tiers of upgrades are unlocked as you progress through Lorem Corp.</p>
                     </>
                  </Program>

                  {getUpgrades(job)}
               </>
            </CorporatePanel>

            <CorporatePanel className="lorem-packs-shop-panel">
               <Program title="Shop" hasMinimizeButton={false} isDraggable={false}>
                  <>
                     {getPackElements()}
                  </>
               </Program>
            </CorporatePanel>

            {jobPanels}
         </div>
      </div>
   )
}

export default CorporateOverview;
