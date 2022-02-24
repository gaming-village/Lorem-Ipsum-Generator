import React from "react";
import "../css/computer.css";
import "../css/programs.css";
import FileSystem from "./FileSystem";
import LoremProductionSystem from "./LoremProductionSystem";
import PopupContainer from "./PopupContainer";
import TaskBar from "./Taskbar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <LoremProductionSystem />

         <FileSystem />

         <PopupContainer />

         <TaskBar />
      </div>
   );
}

export default Computer;