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

               <h3>Mail</h3>
               <p>Change the mail background.</p>
               <div className="mail-thumbnail-container thumbnail-container"></div>

               <h3>Corporate Overview</h3>
               <p>Brighten up the day's suffering with these lifeless wallpapers!</p>
               <div className="corporate-overview-thumbnail-container thumbnail-container"></div>

               <h2>Taskbar Appearance</h2>
               <h2>Applications</h2>
               <p>Change how your Applications appear in the taskbar.</p>
            </>
         </Program>

         <Program title="Application Shop" id="application-shop" className="hidden">
            <>
               <p>Purchase applications to enchance your productivity here at Lorem Corp.</p>

               <h2>test1</h2>

               <p>test2</p>
            </>
         </Program>

         <Program title="Achievement Tracker" id="achievement-tracker" className="hidden">
            <>
               <div className="left-column">
                  <h2>Overview</h2>
                  <p>Achievements: 0/??? <i>(0%)</i></p>

                  <h2>View Mode</h2>
                  <p className="caption">How the achievements are displayed.</p>

                  <h2>Filter</h2>
                  <p className="caption">Filter your achievements based on certain criteria.</p>
                  <div className="filter-container"></div>
               </div>

               <div className="seperator"></div>

               <div className="right-column">
                  <h1>Achievements</h1>
                  <div className="achievement-container"></div>
               </div>
            </>
         </Program>

         <Program title="Intern Enhancement Program" id="intern-enhancement-program" className="hidden">
            <>
               <p>enhance ur interns here!11!1</p>

               <h2>I am a title</h2>

               <p>paragraph</p>
            </>
         </Program>

         <TaskBar />
      </div>
   )
}

export default Computer;
