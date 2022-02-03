import { applications } from "../applications";
import { loremCorp } from "../corporate-overview";
import Game from "../Game";
import preferences, { preferenceData } from "../classes/programs/preferences";
import { getCurrentTime, randInt } from "../utils";
import ACHIEVEMENTS from "./achievements-data";
import LETTERS, { LetterInfo } from "./letter-data";
import LOREM_PACKS from "./lorem-packs-data";
import UPGRADES from "./upgrades-data";
import WORKERS from "./workers";

const decimalToBinaryArr = (num: string): Array<number> => {
   return Number(num).toString(2).split("").reverse().map(Number);
}

interface SaveComponent {
   readonly name: string;
   // The value of the following function is used when no save data is accessible.
   readonly defaultValue: () => string;
   // The value of the following function is used every time the game saves.
   readonly updateValue: () => string;
   // This function will be called when save data is loaded.
   readonly loadEvent: (savedValue: string) => void;
}

const SAVE_COMPONENTS: ReadonlyArray<SaveComponent> = [
   {
      name: "Lorem count",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return Game.lorem.toString();
      },
      loadEvent: (savedValue: string) => {
         Game.lorem = Number(savedValue);
      }
   },
   {
      name: "Time at last save",
      defaultValue: () => {
         return getCurrentTime().toString();
      },
      updateValue: () => {
         return getCurrentTime().toString();
      },
      loadEvent: (savedValue: string) => {
         Game.timeAtLastSave = Number(savedValue);
      }
   },
   {
      name: "Unlocked applications",
      defaultValue: () => {
         let total = 0;
         Object.values(applications).forEach((application, i) => {
            if (application.isUnlocked) total += Math.pow(2, i);
         });
         return total.toString();
      },
      updateValue: () => {
         let total = 0;
         Object.values(applications).forEach((application, i) => {
            if (application.isUnlocked) total += Math.pow(2, i);
         });
         return total.toString();
      },
      loadEvent: (savedValue: string) => {
         const bits = Number(savedValue).toString(2).split("").reverse();
         bits.forEach((bit, i) => {
            const application = Object.values(applications)[i];
            if (bit === "1") application.isUnlocked = true;
         });
      }
   },
   {
      name: "Worker number",
      defaultValue: () => {
         return randInt(10000, 1000000).toString();
      },
      updateValue: () => {
         return loremCorp.workerNumber.toString();
      },
      loadEvent: (savedValue: string) => {
         loremCorp.workerNumber = Number(savedValue);
      }
   },
   {
      name: "Job position index",
      defaultValue: () => {
         return ("0");
      },
      updateValue: () => {
         return loremCorp.jobIndex.toString();
      },
      loadEvent: (savedValue: string) => {
         const jobIndex = Number(savedValue);

         loremCorp.jobIndex = jobIndex;
         loremCorp.job = WORKERS[jobIndex];
         loremCorp.nextJob = WORKERS[jobIndex + 1];
      }
   },
   {
      name: "Worker counts",
      defaultValue: () => {
         return "0-".repeat(WORKERS.length).substr(0, WORKERS.length * 2 - 1);
      },
      updateValue: () => {
         let returnVal = "";
         loremCorp.workers.forEach((workerCount, i) => {
            returnVal += workerCount.toString();
            if (i + 1 < loremCorp.workers.length) returnVal += "-";
         })
         return returnVal;
      },
      loadEvent: (savedValue: string) => {
         // e.g. "5-1-0-0" to [5, 1, 0, 0]
         loremCorp.workers = savedValue.split("-").map(Number);
      }
   },
   {
      name: "Letter data",
      defaultValue: () => {
         return LETTERS.reduce((previousValue, letterInfo, i) => {
            const suffix = i + 1 < LETTERS.length ? "-" : "";
            return previousValue + `${letterInfo.hashID}:0${suffix}`;
         }, "");
      },
      updateValue: () => {
         return LETTERS.reduce((previousValue, letterInfo, i) => {
            let infoTotal: number = 0;
            if (letterInfo.isReceived) infoTotal += 1;
            if (letterInfo.isOpened) infoTotal += 2;
            if (letterInfo.reward && letterInfo.reward.isClaimed) infoTotal += 4;

            const suffix = i + 1 < LETTERS.length ? "-" : "";
            return previousValue + `${letterInfo.hashID}:${infoTotal}${suffix}`;
         }, "");
      },
      loadEvent: (savedValue: string) => {
         const allLetterData: string[] = savedValue.split("-");

         for (const letterSaveData of allLetterData) {
            const hash = Number(letterSaveData.split(":")[0]);

            // Find the letter info
            let letterInfo: LetterInfo = undefined as unknown as LetterInfo;
            for (const currentLetterInfo of LETTERS) {
               if (currentLetterInfo.hashID === hash) {
                  letterInfo = currentLetterInfo;
                  break;
               }
            }

            if (letterInfo) {
               const letterData = Number(letterSaveData.split(":")[1]).toString(2).split("").reverse();
               if (letterInfo!) {
                  letterInfo.isReceived = !!Number(letterData[0]);
                  letterInfo.isOpened = !!Number(letterData[1]);
                  if (letterInfo.reward) {
                     letterInfo.reward.isClaimed = !!Number(letterData[2]);
                  }
               }
            }
         }
      }
   },
   {
      name: "Preferences",
      defaultValue: () => {
         return Object.keys(preferences.backgrounds).reduce((previousValue, _, i) => {
            const suffix = i + 1 < Object.keys(preferences.backgrounds).length ? ":" : "";
            return previousValue + "0" + suffix;
         }, "");
      },
      updateValue: () => {
         return preferenceData.backgroundIndexes.reduce((previousValue, currentValue, i) => {
            const suffix = i + 1 < preferenceData.backgroundIndexes.length ? ":" : "";
            return previousValue + currentValue + suffix;
         }, "");
      },
      loadEvent: (savedValue: string) => {
         preferenceData.backgroundIndexes = savedValue.split(":").map(Number);
      }
   },
   {
      name: "Achievements",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let unlockedAchievementTotal: number = 0;
         ACHIEVEMENTS.forEach((achievement, i) => {
            if (achievement.isUnlocked) unlockedAchievementTotal += Math.pow(2, i);
         });
         return unlockedAchievementTotal.toString();
      },
      loadEvent: (savedValue: string) => {
         const bits = Number(savedValue).toString(2).split("").reverse();

         bits.forEach((bit, i) => {
            const achievement = ACHIEVEMENTS[i];
            if (bit === "1") achievement.isUnlocked = true;
         });
      }
   },
   {
      name: "Bought lorem packs",
      defaultValue: () => {
         return LOREM_PACKS.reduce((previousValue, loremPack, i) => {
            if (loremPack.isBought) return previousValue + Math.pow(2, i);
            return previousValue;
         }, 0).toString();
      },
      updateValue: () => {
         return LOREM_PACKS.reduce((previousValue, loremPack, i) => {
            if (loremPack.isBought) return previousValue + Math.pow(2, i);
            return previousValue;
         }, 0).toString();
      },
      loadEvent: (savedValue: string) => {
         const boughtPacksData = Number(savedValue).toString(2).split("").reverse();

         LOREM_PACKS.forEach((loremPack, i) => {
            if (boughtPacksData[i] === "1") loremPack.isBought = true;
         });
      }
   },
   {
      name: "Typed word count",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return Game.wordsTyped.toString();
      },
      loadEvent: (savedValue: string) => {
         Game.wordsTyped = Number(savedValue);
      }
   },
   {
      name: "Bought upgrades",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return UPGRADES.reduce((previousValue, upgrade, i) => {
            if (upgrade.isBought) return previousValue + Math.pow(2, i);
            return previousValue;
         }, 0).toString();
      },
      loadEvent: (savedValue: string) => {
         const parts = decimalToBinaryArr(savedValue);

         parts.forEach((part, i) => {
            const upgrade = UPGRADES[i];
            if (part === 1) upgrade.isBought = true;
         });
      }
   }
];

export default SAVE_COMPONENTS;