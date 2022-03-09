import { useCallback, useEffect, useState } from "react";
import Game from "../../Game";
import { randFloat, randInt, roundNum } from "../../utils";
import Popup from "./Popup";

interface FallingText {
   /** 0-100 */
   age: number;
   elem: HTMLElement;
}
const fallingTexts = new Array<FallingText>();

const POTENTIAL_CHARS = "!@#$%^&*()".split("");
const createFallingText = (): void => {
   const fallingText = document.createElement("div");
   fallingText.innerHTML = POTENTIAL_CHARS[Math.floor(Math.random() * POTENTIAL_CHARS.length)];
   fallingText.className = "lurem-impsir-falling-text";
   fallingText.style.left = randFloat(0, 100) + "%";
   document.getElementById("computer")?.appendChild(fallingText);

   fallingTexts.push({
      age: 0,
      elem: fallingText
   });
}

const removeFallingTexts = (): void => {
   while (fallingTexts.length > 0) {
      fallingTexts[0].elem.remove();
      fallingTexts.splice(0, 1);
   }
}

/** Used to stop stealLorem from triggering more than once per tick */
let previousTick = 0;

interface ElemProps {
   application: Rain;
}
const Elem = ({ application }: ElemProps) => {
   const [loremStolen, setLoremStolen] = useState(0);

   const STEAL_AMOUNT = 0.3;
   const stealLorem = useCallback(() => {
      Game.lorem -= STEAL_AMOUNT;

      const newLoremStolen = loremStolen + STEAL_AMOUNT;
      application.loremStolen = newLoremStolen;
      setLoremStolen(newLoremStolen);
   }, [loremStolen, application]);

   const update = useCallback(() => {
      if (Game.ticks % Game.tps === 0 && Game.ticks > previousTick) {
         // If lorem can be stolen
         if (Game.lorem - STEAL_AMOUNT >= 0) {
            stealLorem();

            // Create the green falling text
            for (let i = 0; i < randInt(1, 3); i++) {
               createFallingText();
            }
         }

         previousTick = Game.ticks;
      }

      // Animate falling texts
      const fallingTextsToRemove = new Array<FallingText>();
      for (const fallingText of fallingTexts) {
         fallingText.age++;

         if (fallingText.age >= 100) {
            fallingTextsToRemove.push(fallingText);
         } else {
            fallingText.elem.style.top = fallingText.age + "%";
         }
      }

      // Remove old falling texts
      for (const fallingText of fallingTextsToRemove) {
         fallingText.elem.remove();
         fallingTexts.splice(fallingTexts.indexOf(fallingText), 1);
      }
   }, [stealLorem]);

   useEffect(() => {
      console.log("create render listener");
      if (!Game.hasRenderListener(update)) Game.createRenderListener(update);

      return () => {
      console.log("remove render listener");
      Game.removeRenderListener(update);
      }
   }, [update]);

   useEffect(() => {
      return () => {
         // Remove all falling texts
         removeFallingTexts();
      }
   }, []);

   return <>
      <p>It's raining! ({roundNum(loremStolen)})</p>
   </>;
}

class Rain extends Popup {
   loremStolen = 0;

   protected instantiate(): JSX.Element {
      return <Elem application={this} />
   }

   protected closeButtonFunc(): void {
      this.close();

      Game.lorem += this.loremStolen * 1.5;
   }
}

export default Rain;