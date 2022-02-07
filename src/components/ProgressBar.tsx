import React, { useEffect, useRef } from "react";
import { clamp } from "../utils";

interface ProgressBarProps {
   progress: number;
   start: number;
   end: number;
}
const ProgressBar = ({ progress, start, end }: ProgressBarProps) => {
   const progressBar = useRef<HTMLDivElement>(null);
   
   
   useEffect(() => {
      let progressAmount = (progress - start) / (end - start) * 100;
      progressAmount = clamp(progressAmount, 0, 100);
      
      progressBar.current!.style.setProperty("--progress", progressAmount + "%");
   });

   return <div ref={progressBar} className="progress-bar-container">
      <div className="progress-bar"></div>
      <div className="label"></div>
   </div>;
}

export default ProgressBar;
