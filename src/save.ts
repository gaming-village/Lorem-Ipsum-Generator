import { applications } from "./applications";
import { programs } from "./programs";
import Game from "./Game";
import { loremCorp } from "./corporate-overview";

const getCookie = (cname: string): string | null => {
   var name = cname + "=";
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(";");
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
         c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
         return c.substring(name.length, c.length);
      }
   }
   return null;
}

function setCookie(name: string, value: string, exdays?: number): void {
   let expires: string;
   if (exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      expires = 'expires=' + d.toUTCString();
   } else {
      expires = "";
   }
   document.cookie = `${name}=${value};${expires};path=/`;
}

export function updateSave(): void {
   // Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

   // Each save is organised into the sections outlined below.
   // Each section is seperated by a "|" character.
   // In a section, each "part" of the section is seperated by a "_" character.

   // Lorem count
   // Opened applications
   // Corporate Overview
   // Miscellaneous

   const saveName: string = "save1";

   // Lorem count

   let saveData: string = Game.lorem.toString() + "|";

   // Owned applications

   let openedApplicationsTotal: number = 0;
   let i: number = 0;
   for (const application of Object.values(applications)) {
      if (application.isOpened) openedApplicationsTotal += Math.pow(2, i++);
   }
   saveData += openedApplicationsTotal.toString() + "|";

   // Corporate Overview

   const jobIndex = loremCorp.allJobs.indexOf(loremCorp.job);
   saveData += jobIndex.toString() + "|";

   // Miscellaneous

   let currentBackgroundIndexResult: string = "";
   for (let i = 0; i < programs.preferences.currentBackgroundIndexes.length; i++) {
      const index = programs.preferences.currentBackgroundIndexes[i];
      currentBackgroundIndexResult += index.toString();
      if (i < programs.preferences.currentBackgroundIndexes.length - 1) currentBackgroundIndexResult += "-";
   }

   saveData += currentBackgroundIndexResult;

   console.log(saveData);
   setCookie(saveName, saveData);
}

const getCurrentSave = (): string => {
   const saveName: string = "save1";
   const saveData: string = (getCookie(saveName) as string);
   console.log(saveData);
   return saveData;
}

const getDefaultSave = (): string => {
   // Lorem count

   let saveData: string = "0|";

   // Opened applications

   let openedApplicationsTotal: number = 0;
   let i: number = 0;
   for (const application of Object.values(applications)) {
      if (application.isOpened) openedApplicationsTotal += Math.pow(2, i++);
   }
   saveData += openedApplicationsTotal.toString() + "|";

   // Corporate Overview

   // Job
   saveData += "0|";

   // Miscellaneous

   let currentBackgroundIndexesTotal: string = "";
   i = 0;
   programs.preferences.currentBackgroundIndexes.forEach(() => {
      currentBackgroundIndexesTotal += "0";
      if (i < programs.preferences.currentBackgroundIndexes.length - 1) {
         currentBackgroundIndexesTotal += "-";
      }
   });

   saveData += currentBackgroundIndexesTotal;

   return saveData;
}

export function loadSave(): void {
   let saveData = getCurrentSave();
   if (saveData === null) {
      saveData = getDefaultSave();
   }

   const sections: string[] = saveData.split("|");
   for (let i: number = 0; i < sections.length; i++) {
      const section: string = sections[i];

      switch (i) {
         case 0: {
            // Lorem count

            const parts: string[] = section.split("_");

            Game.lorem = Number(parts[0]);

            break;
         } case 1: {
            // Opened applications

            break;
         } case 2: {
            // Corporate Overview

            const parts: string[] = section.split("_");

            loremCorp.job = loremCorp.allJobs[Number(parts[0])];

            break;
         } case 3: {
            // Miscellaneous
            const parts: string[] = section.split("_");

            // Current background image
            const indexes: string[] = parts[0].split("-");
            let newIndexArray: number[] = [];
            for (const index of indexes) {
               newIndexArray.push(Number(index));
            }
            programs.preferences.currentBackgroundIndexes = newIndexArray;

            break;
         }
      }
   }
};