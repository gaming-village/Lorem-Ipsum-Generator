import { roundNum, getElem, getCurrentTime } from "./utils";
import { updateSave } from "./save";
import { loremCorp } from "./corporate-overview";
import { receiveMail } from "./mail";
import { createNotification } from "./notifications";
import achievements, { Achievement } from "./data/achievements-data";
import { unlockAchievement } from "./applications/achievement-tracker";

const Game = {
   ticks: 0,
   tps: 10,
   // TODO: set this to lorem num when the game loads
   previousLorem: 0,
   loremAchievements: [] as Array<Achievement>,
   tick: function(): void {
      this.ticks++;

      const workerLoremProduction = loremCorp.getTotalWorkerProduction();
      if (workerLoremProduction > 0) {
         this.lorem += workerLoremProduction / this.tps;
      }

      if (this.previousLorem !== this.lorem) {
         const loremDiff: number = this.lorem - this.previousLorem;

         const loremLetters: { name: string, requirement: number }[] = [
            {
               name: "loremTips",
               requirement: 4
            },
            {
               name: "freeIPhone",
               requirement: 8
            },
            {
               name: "introduction",
               requirement: 15
            },
            {
               name: "rumors",
               requirement: 20
            },
            {
               name: "bomb",
               requirement: 25
            }
         ];
         for (const letter of loremLetters) {
            if (this.lorem >= letter.requirement) {
               receiveMail(letter.name);
            }
         }

         for (const achievement of this.loremAchievements) {
            if (this.lorem >= achievement.requirements.lorem! && !achievement.isUnlocked) {
               unlockAchievement(achievement.id);
            }
         }

         this.updateLorem();
         this.displayLoremChange(loremDiff);
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
   _wordsTyped: 0,
   get wordsTyped() {
      return this._wordsTyped;
   },
   set wordsTyped(value) {
      this._wordsTyped = value;

      getElem("words-typed").innerHTML = `Words typed: ${this.wordsTyped}`;
   },
   timeAtLastSave: undefined as unknown as number,
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
   lorem: 0 as number,
   updateLorem: function(): void {
      const loremCounterText = getElem("lorem-counter")?.querySelector(".lorem-count");
      if (loremCounterText) loremCounterText.innerHTML = roundNum(this.lorem, 2).toString();

      loremCorp.updatePromotionProgress();
   },
   displayLoremChange: function(loremDiff: number): void {

   },
   isInFocus: false as boolean,
   maskClickEvent: undefined as Function | undefined,
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
   }
};

export default Game;