import React, { useState, useEffect } from "react";
import "../css/corporate-overview.css";
import Button from "./Button";
import WindowsProgram from "./WindowsProgram";
import { loremCorp, switchJSXPanel } from "../corporate-overview";
import { beautify, getPrefix, roundNum } from "../utils";
import List from "./List";
import ProgressBar from "./ProgressBar";
import WORKERS, { Worker } from "../data/workers";
import { getUpgrades } from "../upgrades";
import { getPackElements } from "../lorem-production";
import ButtonContainer from "./ButtonContainer";

interface CorporatePanelProps {
   className?: string;
   children: JSX.Element;
}
const CorporatePanel = (props: CorporatePanelProps) => {
   return (
      <div className={`panel-container hidden ${props.className}`}>
         {props.children}
      </div>
   )
}

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
      const baseWorkerProduction = loremCorp.getBaseWorkerProduction(worker);

      const workerType: string = beautify(worker.name);
      const workerName: string = beautify(worker.name, workerCount);

      const panelName = `${worker.name}-panel`;
      const panel = <CorporatePanel key={i} className={panelName}>
         <>
            <WindowsProgram className="panel" title={workerType} hasMinimizeButton={false}>
               <>
                  <h2>Overview</h2>

                  <p>You have {workerCount} {workerName} producing {roundNum(workerProduction)} lorem every second.</p>

                  <p>Each {workerType} produces {roundNum(baseWorkerProduction)} lorem.</p>
               </>
            </WindowsProgram>

            <WindowsProgram className="panel" title="Purchase" hasMinimizeButton={false}>
               <>
                  <h2>Costs</h2>

                  <div className="cf">
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
                  </div>

                  <ButtonContainer>
                     <>
                     <Button onClick={() => loremCorp.attemptToBuyWorker(worker)}>Buy</Button>
                     <Button onClick={() => loremCorp.buyMaxWorkers(worker)}>Buy Max</Button>
                     </>
                  </ButtonContainer>
               </>
            </WindowsProgram>
         </>
      </CorporatePanel>
      jobPanels.push(panel);

      const button = <Button onClick={() => switchJSXPanel(worker.name)} key={i} className={`${worker.name}-button dark`}>{workerName}</Button>
      jobButtons.push(button);
   }

   return (
      <div id="corporate-overview" className="view">
         <div className="left-bar">
            <h2>Career Information</h2>
            <p className="lorem-count">Lorem:</p>
            <p>Lorem/s: {roundNum(loremCorp.getTotalWorkerProduction())}</p>
            <p id="words-typed">Words typed: 0</p>
            <p>Position: Intern</p>
            <p>Salary: {job.salary}</p>

            <h2>Main</h2>
            <Button className="home-button dark">Home</Button>
            <Button className="upgrades-button dark">Upgrades</Button>

            <h2>Lorem Packs</h2>
            <Button className="lorem-packs-shop-button dark">Browse</Button>
            <Button className="dictionary-button dark">Dictionary</Button>

            {jobButtons.length > 0 ? <h2>Subordinates</h2> : ""}
            <div className="job-button-container">
               {jobButtons}
            </div>
         </div>

         <div className="right-bar">
            <CorporatePanel className="home-panel">
               <>
                  <WindowsProgram className="panel" title="Profile" isDraggable={false} hasMinimizeButton={false}>
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
                  </WindowsProgram>

                  <WindowsProgram className="panel" title="Overview" isDraggable={false} hasMinimizeButton={false}>
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
                  </WindowsProgram>
                  
                  <WindowsProgram className="panel" title="Promote" isDraggable={false} hasMinimizeButton={false}>
                     <>
                        {
                        loremCorp.jobIndex < WORKERS.length - 1 ?
                        <>
                           <p>You are currently {getPrefix(job.name) + " " + beautify(job.name)}. Your next position is as {getPrefix(WORKERS[loremCorp.jobIndex + 1].name) + " " + beautify(WORKERS[loremCorp.jobIndex + 1].name)}.</p>
                           <ProgressBar />
                           <Button onClick={() => loremCorp.attemptToPromote()} isCentered={true}>Promote</Button>
                        </> :
                        <p>You are {getPrefix(job.name) + " " + beautify(job.name)}.</p>
                        }
                     </>
                  </WindowsProgram>
               </>
            </CorporatePanel>

            <CorporatePanel className="upgrades-panel">
               <>
                  <WindowsProgram className="panel" title="Upgrades" hasMinimizeButton={false}>
                     <>
                        <h2>Information</h2>

                        <p>Sacrifice your workers and precious lorem in exchange for powerful boosts.</p>

                        <p>More tiers of upgrades are unlocked as you progress through Lorem Corp.</p>
                     </>
                  </WindowsProgram>

                  {getUpgrades(job)}
               </>
            </CorporatePanel>

            <CorporatePanel className="lorem-packs-shop-panel">
               <WindowsProgram title="Shop" hasMinimizeButton={false} isDraggable={false}>
                  <>
                     {getPackElements()}
                  </>
               </WindowsProgram>
            </CorporatePanel>

            <CorporatePanel className="dictionary-panel">
               <p>Test</p>
            </CorporatePanel>

            {jobPanels}
         </div>
      </div>
   )
}

export default CorporateOverview;
