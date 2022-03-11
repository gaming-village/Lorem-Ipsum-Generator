import { useState } from "react";

import Button from "../Button";

import { JobInfo, JOB_DATA, JOB_TIER_DATA } from "../../data/job-data";
import { CustomAudio } from "../../utils";

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

interface PromotionScreenProps {
   job: JobInfo;
   promoteFunc: (newJob: JobInfo) => void;
}
const PromotionScreen = ({ job, promoteFunc }: PromotionScreenProps) => {
   if (job.tier > JOB_TIER_DATA.length) {
      console.log(job);
      console.trace();
      throw new Error("Tier exceed limit when promoting!");
   }
   let nextJobs = new Array<JobInfo>();
   for (const currentJob of JOB_DATA) {
      if (currentJob.tier < job.tier + 1 || (currentJob.previousJobRequirement && !currentJob.previousJobRequirement.includes(job.name))) continue;
      if (currentJob.tier > job.tier + 1) break;

      nextJobs.push(currentJob);
   }

   const [selectedJob, setSelectedJob] = useState<JobInfo | null>(nextJobs.length !== 1 ? null : nextJobs[0]);

   const switchSelectedJob = (newJob: JobInfo) => {
      setSelectedJob(newJob);
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
   const promotionBenefits = <ul>
      {promotionBenefitData.map((benefit, i) => {
         return <li key={i}>{benefit}</li>
      })}
   </ul>;

   const promotionAttempt = async (job: JobInfo | null) => {
      if (job !== null) {
         new CustomAudio("win95-startup.mp3");

         await playPromotionAnimation();

         promoteFunc(job);
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

         <Button onClick={() => promotionAttempt(nextJobs[0])} isCentered isFlashing>Continue</Button>
      </> : <>
         <p className="benefits">Benefits:</p>
         {promotionBenefits}

         <p className="choose-career-text">Choose your career path:</p>

         <div className="career-path-container">
            {careerPanels}
         </div>

         <p className="selected-label">Selected: <b>{selectedJob ? selectedJob.name : "None"}</b></p>

         <Button isDark={selectedJob === null} isFlashing={selectedJob !== null} isCentered onClick={() => promotionAttempt(selectedJob)}>Continue</Button>
      </>}

      <div className="footer">LoremCorp LLC&trade;</div>
   </div>;
}

export default PromotionScreen;