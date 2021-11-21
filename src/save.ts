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

const getCurrentSave = (): string => {
   const saveData: string = getCookie(saveName) as string;
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

export function loadSave(): void {
   let saveData: string = getCurrentSave();
   if (saveData === null) {
      saveData = getDefaultSave();
   }
   console.log("Loading save data:");
   console.log(`%c${saveData}`, "background: #444; color: #bada55; padding: 2px; border-radius:2px");

   const saveDataComponents = saveData.split("_");
   SAVE_COMPONENTS.forEach((saveComponent, i) => {
      saveComponent.loadEvent(saveDataComponents[i]);
   });
}

// const getCurrentSave = (): string => {
//    const saveName: string = "save1";
//    const saveData: string = (getCookie(saveName) as string);
//    console.log(saveData);
//    return saveData;
// }

// export function updateSave(): void {
//    // Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

//    // Each save is organised into the sections outlined below.
//    // Each section is seperated by a "|" character.
//    // In a section, each "part" of the section is seperated by a "_" character.

//    // Lorem count, time
//    // Opened applications
//    // Corporate Overview
//    // Letter data
//    // Miscellaneous
//    // Achievements

//    const saveName: string = "save1";

//    // Lorem count, time

//    let saveData: string = Game.lorem + "_";

//    saveData += getCurrentTime() + "|";

//    // Owned applications

//    let ownedApplicationsTotal: number = 0;
//    let i: number = 0;
//    for (const application of Object.values(applications)) {
//       if (application.isUnlocked) ownedApplicationsTotal += Math.pow(2, i++);
//    }
//    saveData += ownedApplicationsTotal + "|";

//    // Corporate Overview

//    // Worker number
//    saveData += loremCorp.workerNumber + "_";

//    // Job position
//    saveData += loremCorp.jobIndex + "_";

//    // Workers
//    loremCorp.workers.forEach((count, i) => {
//       saveData += count.toString();
//       saveData += i + 1 < loremCorp.workers.length ? "-" : "|";
//    });

//    // Letter data
//    // Format: hashID-(isReceived_isOpened_rewardIsClaimed from boolean to b10)
//    LETTERS.forEach((letterInfo: LetterInfo, idx: number) => {
//       const hash = letterInfo.hashID;

//       let infoTotal: number = 0;
//       if (letterInfo.isReceived) infoTotal += 1;
//       if (letterInfo.isOpened) infoTotal += 2;
//       if (letterInfo.reward && letterInfo.reward.isClaimed) infoTotal += 4;

//       saveData += `${hash}-${infoTotal}`;

//       if (idx < LETTERS.length - 1) {
//          saveData += "_";
//       } else {
//          saveData += "|";
//       }
//    });

//    // Miscellaneous

//    let currentBackgroundIndexResult: string = "";
//    for (let i = 0; i < programs.preferences.currentBackgroundIndexes.length; i++) {
//       const index = programs.preferences.currentBackgroundIndexes[i];
//       currentBackgroundIndexResult += index.toString();
//       if (i < programs.preferences.currentBackgroundIndexes.length - 1) currentBackgroundIndexResult += "-";
//    }

//    saveData += currentBackgroundIndexResult + "|";

//    // Achievements

//    let unlockedAchievementTotal: number = 0;
//    achievements.forEach((achievement, i) => {
//       if (achievement.isUnlocked) unlockedAchievementTotal += Math.pow(2, i);
//    });
//    saveData += unlockedAchievementTotal;

//    console.log(saveData);
//    setCookie(saveName, saveData);
// }

// const getDefaultSave = (): string => {
//    // Lorem count, time

//    let saveData: string = "0_";

//    saveData += getCurrentTime() + "|";

//    // Owned applications

//    let ownedApplicationsTotal: number = 0;
//    let i: number = 0;
//    for (const application of Object.values(applications)) {
//       if (application.isUnlocked) ownedApplicationsTotal += Math.pow(2, i++);
//    }
//    saveData += ownedApplicationsTotal.toString() + "|";

//    // Corporate Overview

//    // Worker number
//    saveData += randInt(10000, 1000000) + "_";

//    // Job position
//    saveData += "0_";

//    // Workers
//    for (let i = 0; i < WORKERS.length; i++) {
//       saveData += "0";
//       i + 1 < WORKERS.length ? saveData += "-" : saveData += "|";
//    }

//    // Claimed letter rewards
//    LETTERS.forEach((letter: LetterInfo, idx: number) => {
//       saveData += `${letter.hashID}-0`;
//       if (idx < LETTERS.length - 1) {
//          saveData += "_";
//       } else {
//          saveData += "|";
//       }
//    });

//    // Miscellaneous

//    let currentBackgroundIndexesTotal: string = "";
//    i = 0;
//    programs.preferences.currentBackgroundIndexes.forEach(() => {
//       currentBackgroundIndexesTotal += "0";
//       if (i < programs.preferences.currentBackgroundIndexes.length - 1) {
//          currentBackgroundIndexesTotal += "-";
//       }
//    });

//    saveData += currentBackgroundIndexesTotal + "|";

//    // Achievements

//    saveData += "0"

//    return saveData;
// }

// export function loadSave(): void {
//    let saveData: string = getCurrentSave();
//    if (saveData === null) {
//       saveData = getDefaultSave();
//    }

//    const sections: string[] = saveData.split("|");
//    for (let i: number = 0; i < sections.length; i++) {
//       const section: string = sections[i];

//       switch (i) {
//          case 0: {
//             // Lorem count, time

//             const parts: string[] = section.split("_");

//             Game.lorem = Number(parts[0]);

//             Game.timeAtLastSave = Number(parts[1]);

//             break;
//          } case 1: {
//             // Owned applications

//             const parts: string[] = section.split("_");

//             const ownedApplicationBits = Number(parts[0]).toString(2).split("").reverse();
//             ownedApplicationBits.forEach((bit, i) => {
//                const application = Object.values(applications)[i];
//                if (bit === "1") application.isUnlocked = true;
//             })

//             break;
//          } case 2: {
//             // Corporate Overview

//             const parts: string[] = section.split("_");

//             loremCorp.workerNumber = Number(parts[0]);

//             // Job
//             const jobIndex = Number(parts[1]);
//             loremCorp.job = WORKERS[jobIndex];
//             loremCorp.jobIndex = jobIndex;
//             loremCorp.nextJob = WORKERS[jobIndex + 1];

//             // Worker counts
//             const workerCounts = parts[2];
//             loremCorp.workers = workerCounts.split("-").map(count => {
//                return Number(count);
//             });

//             break;
//          } case 3: {
//             const allLetterData: string[] = section.split("_");

//             for (const letterData of allLetterData) {
//                const currentHash = Number(letterData.split("-")[0]);
//                let currentLetter;
//                for (const letter of LETTERS) {
//                   if (letter.hashID === currentHash) {
//                      currentLetter = letter;
//                      break;
//                   }
//                }

//                const dataParts = Number(letterData.split("-")[1]).toString(2).split("").reverse();
//                if (currentLetter) {
//                   currentLetter.isReceived = !!Number(dataParts[0]);
//                   currentLetter.isOpened = !!Number(dataParts[1]);
//                   if (currentLetter.reward) currentLetter.reward.isClaimed = !!Number(dataParts[2]);
//                }
//             }

//             break;
//          } case 4: {
//             // Miscellaneous
//             const parts: string[] = section.split("_");

//             // Current background image
//             const indexes: string[] = parts[0].split("-");
//             let newIndexArray: number[] = [];
//             for (const index of indexes) {
//                newIndexArray.push(Number(index));
//             }
//             programs.preferences.currentBackgroundIndexes = newIndexArray;

//             break;
//          } case 5: {
//             // Achievements

//             const achievementBits = Number(section).toString(2).split("").reverse();

//             achievementBits.forEach((bit, i) => {
//                const achievement = achievements[i];
//                if (bit === "1") achievement.isUnlocked = true;
//             });
//             break;
//          }
//       }
//    }
// };