import React from "react";
import "../css/computer.css";
import "../css/programs.css";
import FileSystem from "./FileSystem";
import LoremProductionSystem from "./LoremProductionSystem";
import TaskBar from "./Taskbar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <LoremProductionSystem />

         <FileSystem />

         <TaskBar />
      </div>
   );
}

export default Computer;