import React, { useEffect, useRef, useState } from "react";
import Game from "../../Game";
import { randInt, randItem, roundNum } from "../../utils";
import Application, { ApplicationCategory } from "./Application";

const createEffectText = (container: HTMLElement): void => {
   if (container === null) return;
   
   const text = document.createElement("span");
   container.appendChild(text);
   text.className = "effect-text";

   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.";
   text.innerHTML = randItem(chars.split(""));

   const pos = randInt(20, 80);
   text.style.left = pos + "%";

   setTimeout(() => text.remove(), 500);
}

interface ElemProps {
   application: LoremCounter;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [lorem, setLorem] = useState(Game.lorem);
   const loremCounter = useRef(null);

   useEffect(() => {
      application.updateLoremCount = (newVal: number): void => {
         setLorem(newVal);
      };
      application.createTextEffect = (): void => {
         createEffectText(loremCounter.current!);
      }

      return () => {
         application.updateLoremCount = null;
      };
   }, [application]);

   return <>
      <p ref={loremCounter}>{roundNum(lorem)} lorem</p>
   </>;
}

class LoremCounter extends Application {
   updateLoremCount: ((newVal: number, diff: number) => void) | null = null;
   createTextEffect: (() => void) | null = null;

   constructor() {
      super({
         name: "Lorem Counter",
         id: "loremCounter",
         fileName: "lorem_counter",
         category: ApplicationCategory.lifestyle,
         description: "Counts your lorem.",
         iconSrc: "lorem-counter.png",
         cost: 0,
         isUnlocked: true,
         isOpenByDefault: true
      });
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default LoremCounter;