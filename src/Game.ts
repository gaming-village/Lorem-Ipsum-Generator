import { roundNum, getElem } from "./utils";
import { updateSave } from "./save";

const Game = {
   ticks: 0 as number,
   tps: 10,
   // TODO: set this to lorem num when the game loads
   previousLorem: 0 as number,
   tick: function() {
      this.ticks++;

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
   _lorem: 0 as number,
   get lorem() {
      return this._lorem;
   },
   set lorem(value) {
      this._lorem = value;
   },
   updateLorem: function() {
      const loremCounterText = getElem("lorem-counter").querySelector("span");
      if (loremCounterText) loremCounterText.innerHTML = roundNum(this.lorem, 2).toString();
   },
   displayLoremChange: function(loremDiff: number) {

   }
};

export default Game;