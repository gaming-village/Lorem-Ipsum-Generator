import { useState } from "react";

import Button from "../Button";

import Game from "../../Game";
import { JobInfo, JOB_DATA, JOB_TIER_DATA } from "../../data/job-data";
import { CustomAudio } from "../../utils";
import { showStartMenu } from "../Taskbar";

const playPromotionAnimation = (): Promise<void> => {
   const animation = document.createElement("div");
   animation.id = "promotion-animation";
   document.body.appendChild(animation);

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

enum Stage {
   JobSelection,
   Benefits
}

const getNextJobs = (job: JobInfo): Array<JobInfo> => {
   let nextJobs = new Array<JobInfo>();
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier < job.tier + 1 || (currentJob.jobOrigins && !currentJob.jobOrigins.includes(job.name))) continue;
      if (currentJob.tier > job.tier + 1) break;

      nextJobs.push(currentJob);
   }
   return nextJobs;
}

interface PromotionScreenProps {
   job: JobInfo;
   promoteFunc: (newJob: JobInfo) => void;
}
const PromotionScreen = ({ job, promoteFunc }: PromotionScreenProps) => {
   const nextJobs = getNextJobs(job);
   const [selectedJob, setSelectedJob] = useState<JobInfo | null>(nextJobs.length !== 1 ? null : nextJobs[0]);
   const [stage, setStage] = useState<Stage>(Stage.JobSelection);

   const switchSelectedJob = (newJob: JobInfo) => {
      setSelectedJob(newJob);
   }

   const advanceStage = (): void => {
      setStage(stage => stage + 1);
   }

   const careerPanels = nextJobs.map((currentJob, i) => {
      return <div onClick={() => switchSelectedJob(currentJob)} className={`career-panel${currentJob === selectedJob ? " selected" : ""}`} key={i}>
         <h3>{currentJob.name}</h3>
         <div className="salary">Salary: {JOB_TIER_DATA[currentJob.tier - 1].salary}</div>

         <ul>
            {currentJob.benefits.map((benefit, j) => {
               return <li key={j}>{benefit}</li>
            })}
         </ul>
      </div>
   });

   const promotionBenefitData = JOB_TIER_DATA[job.tier].benefits;
   const promotionBenefits = <ul className="benefit-list">
      {promotionBenefitData.map((benefit, i) => {
         return <li key={i}>{benefit}</li>
      })}
   </ul>;

   const promote = async () => {
      new CustomAudio("win95-startup.mp3");

      // Play the white flash effect
      await playPromotionAnimation();

      promoteFunc(selectedJob!);

      if (selectedJob!.tier >= 3) {
         // Unlock the start menu
         Game.misc.startMenuIsUnlocked = true;
         showStartMenu();
      }
   }

   return <div id="promotion-screen" className={nextJobs.length === 1 ? "single-option" : ""}>
      {stage === Stage.JobSelection ? <>
         <h1>You've been promoted!</h1>

         {nextJobs.length === 1 ? <>
            <p>New job:</p>

            <div className="career-path-container">
               {careerPanels}
            </div>

            <Button onClick={advanceStage} isCentered isFlashing>Continue</Button>
         </> : <>
            <p className="choose-career-text">Choose your career path:</p>

            <div className="career-path-container">
               {careerPanels}
            </div>

            <p className="selected-label">Selected: <b>{selectedJob ? selectedJob.name : "None"}</b></p>

            <Button isDark={selectedJob === null} isFlashing={selectedJob !== null} onClick={selectedJob !== null ? advanceStage : undefined} isCentered>Continue</Button>
         </>}
      </> : <>
         <p className="benefits">You will also unlock:</p>

         {promotionBenefits}

         <Button className="promote-button" onClick={promote} isCentered isFlashing>Promote</Button>
      </>} 

      <div className="footer">LoremCorp LLC&trade;</div>
   </div>;
}

export default PromotionScreen;