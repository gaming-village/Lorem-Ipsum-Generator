import { roundNum, getElem, getCurrentTime } from "./utils";
import { updateSave } from "./save";
import { loremCorp } from "./corporate-overview";
import { receiveMail } from "./mail";
import { createNotification } from "./notifications";
import achievements, { Achievement } from "./data/achievements-data";
import { unlockAchievement } from "./classes/applications/AchievementTracker";
import { LOREM_LETTERS } from "./data/letter-data";
import ACHIEVEMENTS from "./data/achievements-data";
import { hasUpgrade } from "./upgrades";
import { SettingsType } from "./classes/programs/Settings";

interface GameType {
   ticks: number;
   tps: number;
   lorem: number;
   totalLoremTyped: number;
   previousLorem: number;
   wordsTyped: number;
   loremAchievements: Array<Achievement>;
   settings: SettingsType;
   applications: { [key: string]: any };
   programs: { [key: string]: any };
   tick: () => void;
   loadLoremAchievements: () => void;
   motivation: number;
   updateMotivation: () => void;
   timeAtLastSave: number;
   calculateIdleProfits: () => void;
   updateLorem: (loremDiff: number) => void;
   isInFocus: boolean;
   maskClickEvent: (() => void) | undefined;
   setupMask: () => void;
   showMask: () => void;
   hideMask: () => void;
   reset: () => void;
}
interface UserInfo {
   workerNumber: number;
}

const Game: GameType = {
   ticks: 0,
   tps: 10,
   lorem: 0,
   totalLoremTyped: 0,
   previousLorem: 0,
   wordsTyped: 0,
   loremAchievements: new Array<Achievement>(),
   settings: [],
   applications: {},
   programs: {},
   tick: function(): void {
      this.ticks++;

      const workerLoremProduction = loremCorp.getTotalWorkerProduction();
      if (workerLoremProduction > 0) {
         this.lorem += workerLoremProduction / this.tps;
      }

      if (this.previousLorem !== this.lorem) {
         const loremDiff: number = this.lorem - this.previousLorem;
         this.previousLorem = this.lorem;

         for (const letter of LOREM_LETTERS) {
            if (this.lorem >= letter.requirement) {
               receiveMail(letter.name);
            }
         }

         for (const achievement of this.loremAchievements) {
            if (this.lorem >= achievement.requirements.lorem! && !achievement.isUnlocked) {
               unlockAchievement(achievement.id);
            }
         }

         this.updateLorem(loremDiff);
      }

      const SECONDS_BETWEEN_SAVES: number = 10;
      if (this.ticks % (this.tps * SECONDS_BETWEEN_SAVES) === 0) {
         updateSave();
      }
   },
   loadLoremAchievements: function(): void {
      for (const achievement of achievements) {
         if (Object.keys(achievement.requirements).includes("lorem")) {
            this.loremAchievements.push(achievement);
         }
      }
   },
   motivation: 0,
   updateMotivation: function(): void {
      const unlockedAchievementCount = ACHIEVEMENTS.filter(achievement => achievement.isUnlocked).length;
      this.motivation = Math.pow(unlockedAchievementCount, 0.8);

      if (hasUpgrade("Intern Motivation")) {  
         getElem("achievement-tracker").querySelector(".motivation")!.innerHTML = `Motivation: ${roundNum(this.motivation)}`;
      }
   },
   timeAtLastSave: -1,
   calculateIdleProfits: function(): void {
      const secondsIdle = (getCurrentTime() - this.timeAtLastSave) / 1000;
      const productionWhileIdle = loremCorp.getTotalWorkerProduction() * secondsIdle;

      if (productionWhileIdle === 0) return;

      const notificationInfo = {
         iconSrc: "save.png",
         title: "Idle profits",
         description: `While you were away your workers generated ${roundNum(productionWhileIdle)} lorem.`
      }
      createNotification(notificationInfo, false, true);

      Game.lorem += productionWhileIdle;
   },
   updateLorem: function(loremDiff: number): void {
      const loremCounterUpdateFunc = this.applications.loremCounter.updateLoremCount;
      if (loremCounterUpdateFunc !== null) {
         loremCounterUpdateFunc(this.lorem, loremDiff);
      }

      const loremCountDisplay = roundNum(this.lorem).toString();

      const corporateOverviewCounter = getElem("corporate-overview").querySelector(".lorem-count");
      if (corporateOverviewCounter) corporateOverviewCounter.innerHTML = `Lorem: ${loremCountDisplay}`;

      loremCorp.updatePromotionProgress();
   },
   isInFocus: false,
   maskClickEvent: undefined,
   setupMask: function(): void {
      getElem("mask").addEventListener("click", () => {
         if (this.maskClickEvent) this.maskClickEvent();
      });
   },
   showMask: function(): void {
      getElem("mask").classList.remove("hidden");
   },
   hideMask: function(): void {
      getElem("mask").classList.add("hidden");
   },
   reset: function(): void {
      const saveName = "save1";
      document.cookie = `${saveName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

      // Reload the page
      window.location.reload();
   },
   userInfo: {
      workerNumber: 0
   }
};

export default Game;