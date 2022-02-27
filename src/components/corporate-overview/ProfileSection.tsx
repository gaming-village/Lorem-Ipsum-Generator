import { useEffect, useState } from "react";

import Button from "../Button";
import ProgressBar from "../ProgressBar";

import Game from "../../Game";
import { getPrefix, roundNum } from "../../utils";
import { JOB_TIER_DATA } from "../../data/job-data";
import { SectionProps } from "./CorporateOverview";

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
   }, []);
   
   const currentJobRequirements = JOB_TIER_DATA[job.tier - 1].requirements;
   const nextJobRequirements: number | null = job.tier < JOB_TIER_DATA.length ? JOB_TIER_DATA[job.tier].requirements : null;

   const canPromote = nextJobRequirements !== null ? totalLoremTyped >= nextJobRequirements : false;
   
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
            <li>Salary: {JOB_TIER_DATA[job.tier - 1].salary}</li>
         </ul>
         <div className="footer">LoremCorp LLC&trade;</div>
      </div>

      <h2>Job Status</h2>

      <p>You are currently {getPrefix(job.name)} {job.name}. {nextJobRequirements === null ? "You are at the highest job position current available." : undefined}</p>

      <p>{job.description}</p>

      <p className="promotion-progress">
         {nextJobRequirements !== null ? (
            `${roundNum(totalLoremTyped)} / ${nextJobRequirements}`
         ) : (
            "Max job tier!"
         )}
      </p>

      <ProgressBar progress={nextJobRequirements !== null ? totalLoremTyped : currentJobRequirements + 1} start={currentJobRequirements} end={nextJobRequirements !== null ? nextJobRequirements : currentJobRequirements} />

      {nextJobRequirements !== null ? <>
      <div className="progress-bar-formatter">
         <div>
            <h3>{job.name}</h3>
            <p>{currentJobRequirements} lorem generated</p>
         </div>
         <div>
            <h3>???</h3>
            <p>{nextJobRequirements} lorem generated</p>
         </div>
      </div>

      <Button isDark={!canPromote} isFlashing={canPromote} isCentered={true} onClick={() => promote()}>Promote</Button>
      </> : undefined}
   </>;
}

export default ProfileSection;