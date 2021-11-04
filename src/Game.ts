import { roundNum, getElem } from "./utils";
import { updateSave } from "./save";
import { loremCorp } from "./corporate-overview";

const Game = {
   ticks: 0 as number,
   tps: 10 as number,
   // TODO: set this to lorem num when the game loads
   previousLorem: 0 as number,
   tick: function(): void {
      this.ticks++;

      const workerLoremProduction = loremCorp.getTotalWorkerProduction();
      if (workerLoremProduction > 0) {
         this.lorem += workerLoremProduction / this.tps;
      }

      if (this.previousLorem !== this.lorem) {
         const loremDiff: number = this.lorem - this.previousLorem;

         this.updateLorem();
         this.displayLoremChange(loremDiff);
      }

      const SECONDS_BETWEEN_SAVES: number = 10;
      if (this.ticks % (this.tps * SECONDS_BETWEEN_SAVES) === 0) {
         updateSave();
      }
   },
   lorem: 0 as number,
   updateLorem: function(): void {
      const loremCounterText = getElem("lorem-counter")?.querySelector(".lorem-count");
      if (loremCounterText) loremCounterText.innerHTML = roundNum(this.lorem, 2).toString();
   },
   displayLoremChange: function(loremDiff: number): void {

   },
   isInFocus: false as boolean,
   maskClickEvent: undefined as Function | undefined,
   setupMask: function(): void {
      getElem("mask").addEventListener("click", () => {
         console.log("clicked");
         if (this.maskClickEvent) this.maskClickEvent();
      });
   },
   showMask: function(): void {
      getElem("mask").classList.remove("hidden");
   },
   hideMask: function(): void {
      getElem("mask").classList.add("hidden");
   }
};

export default Game;