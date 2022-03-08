// Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

import SAVE_COMPONENTS from "./data/save-data";

import APPLICATION_DATA, { ApplicationInfo } from "./data/application-data";

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

const setCookie = (name: string, value: string, exdays?: number): void => {
   let expires: string;
   if (exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      expires = "expires=" + d.toUTCString();
   } else {
      expires = "";
   }
   document.cookie = `${name}=${value};${expires};path=/`;
}

const saveName: string = "save1";

export function getCurrentSave(): string | null {
   const saveData = getCookie(saveName);
   return saveData;
}

export function getDefaultSave(): string {
   const defaultSaveArray = SAVE_COMPONENTS.map(saveComponent => {
      return saveComponent.defaultValue();
   });
   return defaultSaveArray.join("_");
}

export function updateSave(): void {
   const newSaveArray = SAVE_COMPONENTS.map(saveComponent => {
      return saveComponent.updateValue();
   });
   const saveData = newSaveArray.join("_");

   // Log save data if in development
   if (process.env.NODE_ENV === "development") console.log(saveData);

   setCookie(saveName, saveData);
}

export function loadSave(saveData: string): void {
   const saveDataComponents = saveData.split("_");

   for (let i = 0; i < SAVE_COMPONENTS.length; i++) {
      const saveComponent = SAVE_COMPONENTS[i];
      try {
         saveComponent.loadEvent(saveDataComponents[i]);
      } catch (e) {
         console.warn(e);
         alert("Malformed save detected. Resetting save! (This usually occurs because a new save component has been added.");
         loadSave(getDefaultSave());
         break;
      }
   }
}

const findAvailableID = (): number => {
   const ids = new Array<number>();
   for (const application of APPLICATION_DATA) {
      ids.push(application.id);
   }

   for (let i = 1; ; i++) {
      if (!ids.includes(i)) return i;
   }
}

/** [ONLY RUNS IN DEVELOPMENT MODE] Ensures that all save data is valid and won't cause issues. */
export function validateSaveData(): void {
   // Make sure all application data has a unique id
   const seenApplications: { [key: number]: ApplicationInfo } = {};

   for (const applicationInfo of APPLICATION_DATA) {
      let applicationWithSameId: ApplicationInfo | undefined;
      for (const [id, info] of Object.entries(seenApplications)) {
         if (Number(id) === applicationInfo.id) {
            applicationWithSameId = info;
            break;
         }
      }

      if (typeof applicationWithSameId !== "undefined") {
         const nextAvailableID = findAvailableID();
         throw new Error(`Applications '${applicationWithSameId.name}' and '${applicationInfo.name}' both have an id of ${applicationInfo.id}! The next available id is ${nextAvailableID}.`);
      }
      seenApplications[applicationInfo.id] = applicationInfo;
   }
}