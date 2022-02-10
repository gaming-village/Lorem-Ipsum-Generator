// Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

import SAVE_COMPONENTS from "./data/save-components-data";

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
   console.log(saveData);

   setCookie(saveName, saveData);
}

export function loadSave(saveData: string): void {
   const saveDataComponents = saveData.split("_");

   for (let i = 0; i < SAVE_COMPONENTS.length; i++) {
      const saveComponent = SAVE_COMPONENTS[i];
      try {
         saveComponent.loadEvent(saveDataComponents[i]);
      } catch {
         console.log(saveData);
         alert("Malformed save detected. Resetting save! (This usually occurs because a new save component has been added.");
         loadSave(getDefaultSave());
         break;
      }
   }
}

// export function loadSave(): void {
//    let saveData = getCurrentSave();
//    if (saveData === null) {
//       saveData = getDefaultSave();
//    }

//    const saveDataComponents = saveData.split("_");
//    SAVE_COMPONENTS.forEach((saveComponent, i) => {
//       saveComponent.loadEvent(saveDataComponents[i]);
//    });
// }