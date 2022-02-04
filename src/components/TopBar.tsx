import React from "react";
import Button from "./Button";
import "../css/top-bar.css";

const TopBar = () => {
   return (
      <div id="top-bar">
         <div className="container">
            <Button id="computer-button" className="view-button">Computer</Button>
            <Button id="mail-button" className="view-button">Mail</Button>
            <Button id="corporate-overview-button" className="view-button">Corporate Overview</Button>
            <Button id="settings-button" className="view-button">Settings</Button>
         </div>
      </div>
   )
}

export default TopBar;