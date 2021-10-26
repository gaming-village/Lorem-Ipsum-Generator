import React from "react";
import Button from "./Button";
import "../css/top-bar.css";

const TopBar = () => {
   return (
      <div id="top-bar">
         <div className="container">
            <Button text="Computer" />
            <Button text="Mail" />
            <Button text="Corporate Overview" />
            <Button text="Settings" />
         </div>
      </div>
   )
}

export default TopBar;