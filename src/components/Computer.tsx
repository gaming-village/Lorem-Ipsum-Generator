import React from "react";
import "../css/computer.css";
import Program from "./Program";
import TaskBar from "./TaskBar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <div id="lorem-container"></div>

         <Program id="lorem-counter" className="hidden">
            <span></span>
         </Program>

         <TaskBar />
      </div>
   )
}

export default Computer;
