import { setUnlockedApplications } from "../applications";
import Game from "../Game";
import { getPreferences, setPreferences } from "../classes/programs/Preferences";
import { getCurrentTime, randInt } from "../utils";
import ACHIEVEMENTS from "./achievements-data";
import LETTERS, { LetterInfo } from "./letter-data";
import LOREM_PACKS from "./lorem-packs-data";
import UPGRADES from "./upgrades-data";
import { getDefaultSettings } from "../classes/programs/Settings";
import { JOB_DATA } from "./corporate-overview-data";

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
         Game.previousLorem = Number(savedValue);
      }
   },
   {
      name: "Total lorem typed",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return Game.totalLoremTyped.toString();
      },
      loadEvent: (savedValue: string) => {
         Game.totalLoremTyped = Number(savedValue);
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
         Object.values(Game.applications).forEach((application, i) => {
            if (application.isUnlocked) total += Math.pow(2, i);
         });
         return total.toString();
      },
      updateValue: () => {
         let total = 0;
         Object.values(Game.applications).forEach((application, i) => {
            if (application.isUnlocked) total += Math.pow(2, i);
         });
         return total.toString();
      },
      loadEvent: (savedValue: string) => {
         const bitmap = Number(savedValue).toString(2).split("").reverse().map(Number) as ReadonlyArray<0 | 1>;
         setUnlockedApplications(bitmap);
      }
   },
   {
      name: "Worker number",
      defaultValue: () => {
         return randInt(10000, 1000000).toString();
      },
      updateValue: () => {
         return Game.userInfo.workerNumber.toString();
      },
      loadEvent: (savedValue: string) => {
         Game.userInfo.workerNumber = Number(savedValue);
      }
   },
   {
      name: "Job position index",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return Game.userInfo.jobPath.toString();
      },
      loadEvent: (savedValue: string) => {
         // TODO: FIX!
         // Game.userInfo.jobPath = Number(savedValue);
      }
   },
   {
      name: "Corporate overview job path",
      // Format:
      // 0010
      // numbers indicate job index per tier, read left to right (last digit = intern)
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return "0";
      },
      loadEvent: (savedValue: string) => {
         Game.userInfo.jobPath = "0";
      }
   },
   {
      name: "Worker counts",
      defaultValue: () => {
         return "0-".repeat(JOB_DATA.length).substring(0, JOB_DATA.length * 2 - 1);
      },
      updateValue: () => {
         let returnVal = "";
         Object.values(Game.userInfo.workers).forEach((workerCount, i) => {
            returnVal += workerCount.toString();
            if (i + 1 < Game.userInfo.workers.length) returnVal += "-";
         })
         return returnVal;
      },
      loadEvent: (savedValue: string) => {
         // e.g. "5-1-0-0" to [5, 1, 0, 0]
         // Game.userInfo.workers = savedValue.split("-").map(Number);
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
         return "0:0:0";
         // return Object.keys(preferences.backgrounds).reduce((previousValue, _, i) => {
         //    const suffix = i + 1 < Object.keys(preferences.backgrounds).length ? ":" : "";
         //    return previousValue + "0" + suffix;
         // }, "");
      },
      updateValue: () => {
         const preferences = getPreferences();

         const selectedBackgrounds = preferences.selectedBackgrounds;
         return selectedBackgrounds.reduce((previousValue, currentValue, i) => {
            const suffix = i + 1 < selectedBackgrounds.length ? ":" : "";
            return previousValue + currentValue + suffix;
         }, "");
      },
      loadEvent: (savedValue: string) => {
         const selectedBackgrounds = savedValue.split(":").map(Number) as [number, number, number];
         setPreferences({
            selectedBackgrounds: selectedBackgrounds
         });
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
   },
   {
      name: "Settings",
      defaultValue: () => {
         const defaultSettings = getDefaultSettings();

         let result = "";
         for (let i = 0; i < defaultSettings.length; i++) {
            const setting = defaultSettings[i];
            switch (setting.type) {
               case "range": {
                  result += setting.value;
                  break;
               }
            }

            if (i < Game.settings.length - 1) result += ":";
         }

         return result;
      },
      updateValue: () => {
         let result = "";
         for (let i = 0; i < Game.settings.length; i++) {
            const setting = Game.settings[i];
            switch (setting.type) {
               case "range": {
                  result += setting.value;
                  break;
               }
            }

            if (i < Game.settings.length - 1) result += ":";
         }

         return result;
      },
      loadEvent: (savedValue: string) => {
         const defaultSettings = getDefaultSettings();

         if (typeof savedValue === "undefined" || savedValue === "") {
            Game.settings = defaultSettings;
            return;
         }

         const settingsData = savedValue.split(":");
         for (let i = 0; i < defaultSettings.length; i++) {
            const setting = defaultSettings[i];
            const dataVal = settingsData[i];

            switch (setting.type) {
               case "range": {
                  const val = parseFloat(dataVal);
                  setting.value = val;
                  break;
               }
            }
         }
         Game.settings = defaultSettings;
      }
   }
];

export default SAVE_COMPONENTS;