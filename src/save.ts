// Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

import SAVE_COMPONENTS from "./data/save-data";

import APPLICATION_DATA from "./data/application-data";
import { MAIN_UPGRADE_DATA, MINOR_UPGRADE_DATA } from "./data/upgrade-data";

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


interface SaveElement {
   id: number;
}
type SaveObject = ReadonlyArray<SaveElement>;

/** Finds the smallest ID in a save object which isn't taken. */
const findAvailableID = (saveObject: SaveObject): number => {
   const ids = new Array<number>();
   for (const application of saveObject) {
      ids.push(application.id);
   }

   for (let i = 1; ; i++) {
      if (!ids.includes(i)) return i;
   }
}

/** Checks a save object and ensures that its ID's are all correctly placed. */
const validateSaveObject = (objectName: string, saveObject: SaveObject): void => {
   const seenIDS = new Array<number>();

   for (const element of saveObject) {
      // Prevent ID's < 1
      if (element.id < 1) {
         throw new Error(`An element in ${objectName} has an ID less than 1. All ID's must be above 0.`);
      }
      // Prevent duplicate ID's
      if (seenIDS.includes(element.id)) {
         const nextAvailableID = findAvailableID(saveObject);
         throw new Error(`More than one element in ${objectName} has an id of ${element.id}! Consider changing one to the next available ID of ${nextAvailableID}`);
      }
      seenIDS.push(element.id);
   }
}

/** [ONLY RUNS IN DEVELOPMENT MODE] Ensures that all save data is valid and won't cause issues. */
export function validateSaveData(): void {
   validateSaveObject("Application Data", APPLICATION_DATA);
   const allUpgrades = [ ...MAIN_UPGRADE_DATA, ...MINOR_UPGRADE_DATA ];
   validateSaveObject("All Upgrades", allUpgrades);
}