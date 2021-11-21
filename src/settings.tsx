import React from "react";
import SETTINGS, { settingCategories } from "./data/settings-data";

export function getSettings(): Array<JSX.Element> {
   let settingsArray: Array<JSX.Element> = [];

   let settingsCount = -1;
   for (let i = 0; i < settingCategories.length; i++) {
      const category = settingCategories[i];

      const header = <h2 key={i}>{category.name}</h2>
      settingsArray.push(header);

      let categoryArray: Array<JSX.Element> = [];
      const currentSettings = SETTINGS.filter(setting => setting.category === category.id);
      for (let k = 0; k < currentSettings.length; k++) {
         settingsCount++;
         const setting = currentSettings[k];

         const newSetting = <div key={settingsCount} className="setting cf">
            <div className="left">
               <div className="label">{setting.label}</div>
            </div>
            <div className="right"></div>
         </div>
         categoryArray.push(newSetting);
      }

      const container = <div key={i + settingCategories.length} className="settings-container">
         {categoryArray}
      </div>
      settingsArray.push(container);
   }

   return settingsArray;
}