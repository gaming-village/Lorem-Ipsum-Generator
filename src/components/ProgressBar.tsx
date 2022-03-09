import { useEffect, useRef } from "react";

import { clamp, roundNum } from "../utils";

interface ProgressBarProps {
   progress: number;
   start: number;
   end: number;
   showProgress?: boolean
}
const ProgressBar = ({ progress, start, end, showProgress = false }: ProgressBarProps) => {
   const progressBar = useRef<HTMLDivElement>(null);
   
   let progressAmount = (progress - start) / (end - start) * 100;
   progressAmount = clamp(progressAmount, 0, 100);
   
   useEffect(() => {
      
      progressBar.current!.style.setProperty("--progress", progressAmount + "%");
      progressBar.current!.className = "progress-bar-container" + (progressAmount === 100 ? " complete" : "");
   }, [end, progress, progressAmount, start]);

   return <div ref={progressBar} className="progress-bar-container">
      <div className="progress-bar"></div>
      {showProgress ? (
         <div className="label">{roundNum(progressAmount, 0)}%</div>
      ) : undefined}
   </div>;
}

export default ProgressBar;
