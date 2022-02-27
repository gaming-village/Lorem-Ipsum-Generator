import { roundNum, getElem, getCurrentTime } from "./utils";
import { updateSave } from "./save";
import { receiveMail } from "./mail";
import achievements, { Achievement } from "./data/achievements-data";
import { unlockAchievement } from "./classes/applications/AchievementTracker";
import { LOREM_LETTERS } from "./data/letter-data";
import ACHIEVEMENTS from "./data/achievements-data";
import { SettingsType } from "./classes/programs/Settings";
import { JOB_DATA, Job } from "./data/job-data";
import { calculateWorkerProduction, hasUpgrade } from "./components/corporate-overview/CorporateOverview";
import Application from "./classes/applications/Application";
import Program from "./classes/programs/Program";
import LoremCounter from "./classes/applications/LoremCounter";
import { createNotification } from "./notifications";

interface UserInfo {
   workerNumber: number;
   job: Job;
   previousJobs: Array<Job>;
   workers: { [key: string ]: number};
}
interface GameType {
   version: string;
   currentView: string;
   ticks: number;
   readonly tps: number;
   lorem: number;
   totalLoremTyped: number;
   previousLorem: number;
   wordsTyped: number;
   loremAchievements: Array<Achievement>;
   settings: SettingsType;
   applications: { [key: string]: Application };
   programs: { [key: string]: Program };
   readonly tick: () => void;
   readonly updateLorem: () => void;
   packets: number;
   packetExchangeRate: number;
   loadLoremAchievements: () => void;
   motivation: number;
   updateMotivation: () => void;
   timeAtLastSave: number;
   calculateIdleProfits: () => void;
   displayLorem: (loremDiff: number) => void;
   isInFocus: boolean;
   maskClickEvent: (() => void) | undefined;
   showMask: () => void;
   hideMask: () => void;
   reset: () => void;
   userInfo: UserInfo;
   renderListeners: Array<() => void>;
   createRenderListener: (func: () => void) => void;
   removeRenderListener: (func: () => void) => void;
   hasRenderListener: (func: () => void) => boolean;
   blurScreen: () => void;
   unblurScreen: () => void;
}

const Game: GameType = {
   version: "0.1",
   currentView: "computer",
   ticks: 0,
   tps: 20,
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

      for (const func of this.renderListeners) func();

      const homePaths = ["/", "/Lorem-Ipsum-Generator", "/Lorem-Ipsum-Generator/"]
      if (homePaths.includes(window.location.pathname)) {
         this.updateLorem();
      }

      const SECONDS_BETWEEN_SAVES: number = 10;
      if (this.ticks % (this.tps * SECONDS_BETWEEN_SAVES) === 0) {
         updateSave();
      }
   },
   updateLorem: function(): void {
      const workerProduction = calculateWorkerProduction();
      if (workerProduction > 0 && this.ticks % this.tps === 0) {
         this.lorem += workerProduction;
      }

      if (this.previousLorem !== this.lorem) {
         const loremDiff: number = this.lorem - this.previousLorem;

         // Add to the total lorem typed
         if (loremDiff > 0) this.totalLoremTyped += loremDiff;

         for (const letter of LOREM_LETTERS) {
            if (this.lorem >= letter.requirement && this.previousLorem < letter.requirement) {
               receiveMail(letter.name);
            }
         }

         for (const achievement of this.loremAchievements) {
            if (this.lorem >= achievement.requirements.lorem! && !achievement.isUnlocked) {
               unlockAchievement(achievement.id);
            }
         }

         this.displayLorem(loremDiff);

         const loremCounter = this.applications.loremCounter as LoremCounter;
         if (typeof loremCounter !== "undefined" && loremCounter.createTextEffect !== null) {
            loremCounter.createTextEffect(loremDiff < 0);
         }

         this.previousLorem = this.lorem;
      }
   },
   packets: 0,
   packetExchangeRate: 0.1,
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
      const idleProduction = calculateWorkerProduction() * secondsIdle;

      if (idleProduction > 0) {
         createNotification({
            iconSrc: "save.png",
            title: "Idle profits",
            description: `While you were away your workers generated ${roundNum(idleProduction)} lorem.`,
            isClickable: false,
            hasCloseButton: true,
            playSound: false
         });

         this.lorem += idleProduction;
      }
   },
   displayLorem: function(loremDiff: number): void {
      const loremCounter = this.applications.loremCounter as LoremCounter;
      if (typeof loremCounter !== "undefined" && loremCounter.updateLoremCount !== null) {
         loremCounter.updateLoremCount(this.lorem, loremDiff);
      }
   },
   isInFocus: false,
   maskClickEvent: undefined,
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
   renderListeners: new Array<() => void>(),
   createRenderListener: function(func: () => void): void {
      this.renderListeners.push(func);
   },
   removeRenderListener: function(func: () => void): void {
      const idx = this.renderListeners.indexOf(func);
      this.renderListeners.splice(idx, 1);
   },
   hasRenderListener: function(func: () => void): boolean {
      return this.renderListeners.indexOf(func) !== -1;
   },
   userInfo: {
      workerNumber: 0,
      job: JOB_DATA[0],
      previousJobs: new Array<Job>(),
      workers: {}
   },
   blurScreen: () => {
      document.body.classList.add("blurred");
   },
   unblurScreen: () => {
      document.body.classList.remove("blurred");
   }
};

export default Game;