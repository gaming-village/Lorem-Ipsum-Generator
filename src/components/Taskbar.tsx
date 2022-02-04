import React from "react";
import "../css/taskbar.css";
import StartIcon from "../images/start-icon.png";

const TaskBar = () => {
   return (
      <div id="taskbar">
         <div id="start-button" className="application-segment">
            <img src={StartIcon} alt="" />
            <div className="text">Start</div>
         </div>
      </div>
   )
}

export default TaskBar;
