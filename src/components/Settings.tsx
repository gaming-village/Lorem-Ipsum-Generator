import React from "react";
import { getSettings } from "../settings";
import "../css/settings.css";

const Settings = () => {
   return (
      <div id="settings" className="view">
         <div id="settings-main">
            <>
               <h1>Settings</h1>
               {getSettings()}
            </>
         </div>
      </div>
   )
}

export default Settings;
