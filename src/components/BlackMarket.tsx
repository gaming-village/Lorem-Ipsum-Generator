import React, { useEffect, useRef } from 'react';
import "../css/black-market.css";
import Game from '../Game';
import { randInt, randItem } from '../utils';

interface FallingText {
   age: number;
   elem: HTMLElement;
}
let fallingTexts = new Array<FallingText>();
const createFallingText = (blackMarket: HTMLElement): void => {
   const potentialText = "0123456789!@#$%^&*()";
   const text = randItem(potentialText.split(""));
   
   const fallingText = document.createElement("div");
   fallingText.innerHTML = text;
   fallingText.className = "falling-text";
   fallingText.style.left = randInt(0, 25) * 4 + 1.25 + "%";
   fallingTexts.push({
      age: 0,
      elem: fallingText
   });
   blackMarket.appendChild(fallingText);
}

export let showBlackMarket: () => void;

const BlackMarket = () => {
   const blackMarket = useRef(null);

   showBlackMarket = () => {

   }

   useEffect(() => {
      const createFallingTextFunc = (): void => {
         if (Math.random() < 5 / Game.tps) {

            createFallingText(blackMarket.current!);
         }

         let textsToRemove = new Array<FallingText>();
         for (const text of fallingTexts) {
            if (text.age++ >= 2000 / Game.tps) {
               textsToRemove.push(text);
            }
            text.elem.style.top = text.age * Game.tps / 20 + "%";
         }

         for (const textToRemove of textsToRemove) {
            textToRemove.elem.remove();

            const idx = fallingTexts.indexOf(textToRemove);
            fallingTexts.splice(idx, 1);
         }
      }

      Game.createRenderListener(createFallingTextFunc);
   }, []);

   return <div ref={blackMarket} id="black-market" className="view">
      BlackMarket
   </div>;
}

export default BlackMarket;