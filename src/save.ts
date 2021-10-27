import { applications } from "./applications";
import Game from "./Game";

const getCookie = (cname: string) => {
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

function setCookie(name: string, value: string, exdays?: number) {
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

export function updateSave() {
   // Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

   // Each save is organised into the sections outlined below.
   // Each section is seperated by a "|" character.
   // In a section, each "part" of the section is seperated by a "_" character.

   // Lorem count
   // Opened applications

   const saveName: string = "save1";

   let saveData: string = Game.lorem.toString() + "|";

   let openedApplicationsTotal: number = 0;
   let i: number = 0;
   for (const application of Object.values(applications)) {
      if (application.isOpened) openedApplicationsTotal += Math.pow(2, i++);
   }
   saveData += openedApplicationsTotal.toString() + "|";

   console.log(saveData);
   setCookie(saveName, saveData);
}

export function getCurrentSave() {
   const saveName: string = "save1";
   const saveData = getCookie(saveName);
   return saveData;
}

export function getDefaultSave() {
   // Lorem count
   let saveData: string = "0|";

   // Opened applications
   let openedApplicationsTotal: number = 0;
   let i: number = 0;
   for (const application of Object.values(applications)) {
      if (application.isOpened) openedApplicationsTotal += Math.pow(2, i++);
   }
   saveData += openedApplicationsTotal.toString() + "|";

   return saveData;
}