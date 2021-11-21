import React from "react";
import Button from "./Button";
import "../css/top-bar.css";

const TopBar = () => {
   return (
      <div id="top-bar">
         <div className="container">
            <Button id="computer-button" className="view-button" text="Computer" />
            <Button id="mail-button" className="view-button" text="Mail" />
            <Button id="corporate-overview-button" className="view-button" text="Corporate Overview" />
            <Button id="settings-button" className="view-button" text="Settings" />
         </div>
      </div>
   )
}

export default TopBar;