import Game from "../Game";
import { getPreferences, setPreferences } from "../classes/programs/Preferences";
import { getCurrentTime, randInt } from "../utils";
import ACHIEVEMENT_DATA from "./achievement-data";
import LETTER_DATA from "./letter-data";
import LOREM_PACKS from "./lorem-pack-data";
import UPGRADE_DATA from "./upgrade-data";
import { getDefaultSettings } from "../classes/programs/Settings";
import { JobInfo, JOB_DATA } from "./job-data";
import { BLACK_MARKET_SHOPS } from "./black-market-data";
import POPUP_DATA from "./popup-data";
import APPLICATION_DATA from "./application-data";

const HEX_UNITS: { [key: number]: string } = {
   0: "0",
   1: "1",
   2: "2",
   3: "3",
   4: "4",
   5: "5",
   6: "6",
   7: "7",
   8: "8",
   9: "9",
   10: "A",
   11: "B",
   12: "C",
   13: "D",
   14: "E",
   15: "F"
};

const hexToArr = (num: string): Array<number> => {
   if (num === "0") return [0];

   const dec = hexToDec(num);
   
   let numTrailingZeros = 0;
   while (dec[numTrailingZeros] === "0") {
      numTrailingZeros++;
   }
   
   const trailingZeros = new Array<number>(numTrailingZeros);
   trailingZeros.fill(0);

   const binary = Number(dec).toString(2).split("").map(Number).reverse();

   return trailingZeros.concat(binary);
}

const decToHex = (rawNum: number | string): string => {
   if (rawNum === 0) return "0";

   if (typeof rawNum === "number" && isNaN(rawNum)) {
      console.trace();
      throw new Error("Tried to convert NaN to hex!");
   }

   // Account for any leading 0's
   let numLeadingZeros = 0;
   if (typeof rawNum === "string") {
      while (rawNum[numLeadingZeros] === "0") {
         numLeadingZeros++;
      }
   }

   const num = Number(rawNum);

   // If negative
   if (Math.sign(num) === -1) return "-" + decToHex(Math.abs(num));

   // If not integer
   if (!Number.isInteger(num)) {
      const [units, decimalPlaces] = typeof rawNum === "number" ? num.toString().split(".") : rawNum.split(".");
      return decToHex(units) + "." + decToHex(decimalPlaces);
   }

   // Find the highest corresponding b16 power
   let maxB16power: number = 1;
   for (let i = 0; ; i++) {
      const newPower = Math.pow(16, i);
      if (newPower > num) {
         break;
      }
      maxB16power = newPower;
   }

   let result = "";
   let remainder = num;
   while (remainder > 0) {
      const multiple = Math.floor(remainder / maxB16power);
      remainder -= multiple * maxB16power;
      result += HEX_UNITS[multiple];
      maxB16power /= 16;
   }

   return "0".repeat(numLeadingZeros) + result;
}

const decToBin = (dec: number): Array<number> => {
   // Find the highest corresponding binary power
   let maxPower: number = 1;
   for (let i = 0; ; i++) {
      const newPower = Math.pow(2, i);
      if (newPower > dec) {
         break;
      }
      maxPower = newPower;
   }
   
   const bits = new Array<number>();
   let remainder = dec;
   while (remainder > 0) {
      const multiple = Math.floor(remainder / maxPower);
      remainder -= multiple * maxPower;
      bits.push(multiple);
      maxPower /= 2;
   }
   while (maxPower >= 1) {
      maxPower /= 2;
      bits.push(0);
   }
   return bits;
}

const hexToDec = (num: string): string => {
   if (num === "0") return "0";

   // If negative
   if (num[0] === "-") {
      return "-" + hexToDec(num.substring(1, num.length));
   }

   let numLeadingZeros = 0;
   while (num[numLeadingZeros] === "0") {
      numLeadingZeros++;
   }

   // If the number isn't an integer
   if (num.split("").indexOf(".") !== -1) {
      const [units, decimalPlaces] = num.toString().split(".");
      return hexToDec(units) + "." + hexToDec(decimalPlaces);
   }

   let result = 0;
   for (let i = 0; i < num.length; i++) {
      const hexUnit = num[i];

      // Find the hex unit's corresponding decimal number
      let decUnit!: number;
      for (const [dec, hex] of Object.entries(HEX_UNITS)) {
         if (hex === hexUnit) {
            decUnit = Number(dec);
            break;
         }
      }

      result += decUnit * Math.pow(16, num.length - i - 1);
   }
   return "0".repeat(numLeadingZeros) + result;
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
         return decToHex(Game.lorem);
      },
      loadEvent: (savedValue: string) => {
         const decVal = Number(hexToDec(savedValue));
         Game.lorem = decVal;
         Game.previousLorem = decVal;
      }
   },
   {
      name: "Total lorem typed",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return decToHex(Game.totalLoremTyped);
      },
      loadEvent: (savedValue: string) => {
         Game.totalLoremTyped = Number(hexToDec(savedValue));
      }
   },
   {
      name: "Time at last save",
      defaultValue: () => {
         return decToHex(getCurrentTime());
      },
      updateValue: () => {
         return decToHex(getCurrentTime());
      },
      loadEvent: (savedValue: string) => {
         Game.timeAtLastSave = Number(hexToDec(savedValue));
      }
   },
   {
      name: "Unlocked applications",
      defaultValue: () => {
         let total = 0;
         for (const application of APPLICATION_DATA) {
            if (application.isUnlocked) total += Math.pow(2, application.id - 1);
         }
         return decToHex(total);
      },
      updateValue: () => {
         let total = 0;
         for (const application of APPLICATION_DATA) {
            if (application.isUnlocked) total += Math.pow(2, application.id - 1);
         }
         return decToHex(total);
      },
      loadEvent: (savedValue: string) => {
         const bits = hexToArr(savedValue);
         for (const application of APPLICATION_DATA) {
            if (application.id > bits.length) continue;
            application.isUnlocked = bits[application.id - 1] === 1;
         }
      }
   },
   {
      name: "Worker number",
      defaultValue: () => {
         return decToHex(randInt(10000, 1000000));
      },
      updateValue: () => {
         return decToHex(Game.userInfo.workerNumber);
      },
      loadEvent: (savedValue: string) => {
         Game.userInfo.workerNumber = Number(hexToDec(savedValue));
      }
   },
   {
      name: "Job history",
      // Format:
      // 0010
      // numbers indicate job index per tier, read left to right (left most digit = intern, right most = highest job)
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let result = "";
         let i = -1;
         let previousTier = 1;
         for (const job of JOB_DATA) {
            if (job.tier > Game.userInfo.previousJobs.length) break;

            if (job.tier !== previousTier) {
               previousTier = job.tier;
               i = 0;
            } else {
               i++;
            }

            if (Game.userInfo.previousJobs.includes(job)) {
               result += i;
            }
         }
         return decToHex(result);
      },
      loadEvent: (savedValue: string) => {
         const dec = hexToDec(savedValue);
         const jobIndexes = dec.split("").map(Number);

         let i = -1;
         let previousTier = 1;
         const previousJobs = new Array<JobInfo>();
         for (const job of JOB_DATA) {
            if (job.tier > jobIndexes.length) break;

            if (job.tier !== previousTier) {
               previousTier = job.tier;
               i = 0;
            } else {
               i++;
            }

            const actualJobIndex = jobIndexes[job.tier - 1];
            if (i === actualJobIndex) {
               previousJobs.push(job);
            }
         }

         Game.userInfo.previousJobs = previousJobs;
         Game.userInfo.job = previousJobs[previousJobs.length - 1];

         // Check if the user has unlocked the start menu
         const jobTier = jobIndexes.length;
         if (jobTier >= 3) {
            Game.misc.startMenuIsUnlocked = true;
         }
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
            returnVal += decToHex(workerCount);
            if (i + 1 < JOB_DATA.length) returnVal += "-";
         });
         return returnVal;
      },
      loadEvent: (savedValue: string) => {
         const workerCounts = savedValue.split("-").map(hexToDec).map(Number);
         for (let i = 0; i < JOB_DATA.length; i++) {
            const worker = JOB_DATA[i];
            const count = workerCounts[i];

            if (!Number.isNaN(count) && typeof count !== "undefined") {
               Game.userInfo.workers[worker.id] = count;
            } else {
               console.warn(`Worker '${worker.name}' count was NaN or undefined! Setting to 0`);
               Game.userInfo.workers[worker.id] = 0;
            }
         }
      }
   },
   {
      name: "Letter data",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let resultArr = new Array<number>();
         for (const letter of LETTER_DATA) {
            let part = 0;
            if (letter.isReceived) {
               part += 1;
               if (letter.isOpened) {
                  part += 2;
                  if (typeof letter.reward !== "undefined" && letter.reward.isClaimed) {
                     part += 4;
                  }
               }
            }
            resultArr[letter.id - 1] = part;
         }

         let result = resultArr.map(num => num.toString()).join("");

         // Remove trailing 0's
         let numTrailingZeros = 0;
         while (result[result.length - numTrailingZeros - 1] === "0") {
            numTrailingZeros++;
         }
         if (numTrailingZeros > 0) {
            result = result.substring(0, result.length - numTrailingZeros);
         }

         return result;
      },
      loadEvent: (savedValue: string) => {
         const parts = savedValue.split("").map(Number);

         for (let i = 0; i < LETTER_DATA.length; i++) {
            const letter = LETTER_DATA[i], part = parts[i] || 0;
            if (part === 0) continue;
            const bits = decToBin(part).reverse();

            letter.isReceived = bits[0] === 1;
            letter.isOpened = (bits[1] || 0) === 1;
            if (typeof letter.reward !== "undefined") {
               letter.reward.isClaimed = (bits[2] || 0) === 1

               // Unlock the black market
               if (letter.subject === "Invitation" && letter.reward.isClaimed) {
                  Game.misc.blackMarketIsUnlocked = true;
               }
            };
         }
      }
   },
   {
      name: "Preferences",
      defaultValue: () => {
         return "0-0-0";
      },
      updateValue: () => {
         const preferences = getPreferences();

         const selectedBackgrounds = preferences.selectedBackgrounds;
         return selectedBackgrounds.reduce((previousValue, currentValue, i) => {
            const suffix = i + 1 < selectedBackgrounds.length ? "-" : "";
            return previousValue + currentValue + suffix;
         }, "");
      },
      loadEvent: (savedValue: string) => {
         const selectedBackgrounds = savedValue.split("-").map(Number) as [number, number, number];
         setPreferences({
            selectedBackgrounds: selectedBackgrounds
         });
      }
   },
   {
      name: "Unlocked achievements",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let total = 0;
         for (const achievement of ACHIEVEMENT_DATA) {
            if (achievement.isUnlocked) {
               total += Math.pow(2, achievement.id - 1);
            }
         }
         return decToHex(total);
      },
      loadEvent: (savedValue: string) => {
         const bits = hexToArr(savedValue);
         for (const achievement of ACHIEVEMENT_DATA) {
            if (achievement.id > bits.length) continue;
            achievement.isUnlocked = bits[achievement.id - 1] === 1;
         }
      }
   },
   {
      name: "Bought lorem packs",
      defaultValue: () => {
         let total = 0;
         for (const loremPack of LOREM_PACKS) {
            if (loremPack.isBought) total += Math.pow(2, loremPack.id - 1);
         }
         return decToHex(total);
      },
      updateValue: () => {
         let total = 0;
         for (const loremPack of LOREM_PACKS) {
            if (loremPack.isBought) total += Math.pow(2, loremPack.id - 1);
         }
         return decToHex(total);
      },
      loadEvent: (savedValue: string) => {
         const bits = hexToArr(savedValue);
         for (const loremPack of LOREM_PACKS) {
            if (loremPack.id > bits.length) continue;
            loremPack.isBought = bits[loremPack.id - 1] === 1;
         }
      }
   },
   {
      name: "Typed word count",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         return decToHex(Game.wordsTyped);
      },
      loadEvent: (savedValue: string) => {
         Game.wordsTyped = Number(hexToDec(savedValue));
      }
   },
   {
      name: "Bought upgrades",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let total = 0;
         for (const upgrade of UPGRADE_DATA) {
            if (upgrade.isBought) total += Math.pow(2, upgrade.id - 1);
         }
         return decToHex(total);
      },
      loadEvent: (savedValue: string) => {
         const bits = hexToArr(savedValue);
         for (const upgrade of UPGRADE_DATA) {
            if (upgrade.id > bits.length) continue;
            upgrade.isBought = bits[upgrade.id - 1] === 1;
         }
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

            if (i < Game.settings.length - 1) result += "-";
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

            if (i < Game.settings.length - 1) result += "-";
         }

         return result;
      },
      loadEvent: (savedValue: string) => {
         const defaultSettings = getDefaultSettings();

         if (typeof savedValue === "undefined" || savedValue === "") {
            Game.settings = defaultSettings;
            return;
         }

         const settingsData = savedValue.split("-");
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
   },
   {
      name: "Packets",
      defaultValue: () => {
         return "0"
      },
      updateValue: () => {
         return decToHex(Game.packets);
      },
      loadEvent: (savedValue: string) => {
         Game.packets = Number(hexToDec(savedValue));
      }
   },
   {
      name: "Unlocked black market shops",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let result = 0;
         for (const shop of BLACK_MARKET_SHOPS) {
            if (shop.isUnlocked) result += Math.pow(2, shop.id - 1);
         }
         return decToHex(result);
      },
      loadEvent: (savedValue: string) => {
         const bits = hexToArr(savedValue);
         for (const shop of BLACK_MARKET_SHOPS) {
            if (shop.id > bits.length) break;
            shop.isUnlocked = bits[shop.id - 1] === 1;
         }
      }
   },
   {
      name: "Unlocked popups",
      defaultValue: () => {
         return "0";
      },
      updateValue: () => {
         let result = 0;
         for (const popup of POPUP_DATA) {
            if (popup.isUnlocked) result += Math.pow(2, popup.id - 1);
         }
         return decToHex(result);
      },
      loadEvent: (savedValue: string) => {
         const bits = hexToArr(savedValue);
         for (const popup of POPUP_DATA) {
            if (popup.id > bits.length) break;
            popup.isUnlocked = bits[popup.id - 1] === 1;
         }
      }
   }
];

export default SAVE_COMPONENTS;