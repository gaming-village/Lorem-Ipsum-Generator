import React from "react";
import "../css/computer.css";
import "../css/programs.css";
import FileSystem from "./FileSystem";
import TaskBar from "./Taskbar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <div id="lorem-container">
            <span className="instruction">(Type to generate lorem)</span>
         </div>

         <FileSystem />

         <TaskBar />
      </div>
   )
}

export default Computer;
