import React from "react";
import "../css/computer.css";
import Program from "./Program";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <div id="test"></div>
         <Program id="lorem-counter">
            <span></span>
         </Program>
      </div>
   )
}

export default Computer;
