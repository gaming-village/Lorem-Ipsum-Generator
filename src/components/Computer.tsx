import React from "react";
import "../css/computer.css";
import "../css/programs.css";
import Program from "./Program";
import TaskBar from "./TaskBar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <div id="lorem-container">
            <span>(Type to generate lorem)</span>
         </div>

         <Program title="lorem_counter.gov" hasMinimizeButton={false} id="lorem-counter" className="hidden">
            <span className="lorem-count"></span>
         </Program>

         <Program title="Preferences" id="preferences" className="hidden">
            <>
               <h2>Background Image</h2>

               <h3>Computer</h3>
               <p>Customise your Computer's background image to your liking.</p>
               <div className="computer-thumbnail-container thumbnail-container"></div>

               <h3>Corporate Overview</h3>
               <p>Brighten up the day's suffering with these lifeless wallpapers!</p>
               <div className="corporate-overview-thumbnail-container thumbnail-container"></div>

               <h2>Taskbar Appearance</h2>
               <h2>Applications</h2>
               <p>Change how your Applications appear in the taskbar.</p>
            </>
         </Program>

         <TaskBar />
      </div>
   )
}

export default Computer;
