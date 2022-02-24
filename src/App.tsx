import React, { useEffect, useRef } from "react";
import Devtools from "./components/Devtools";
import Main from "./components/Main";
import { toggleDevtools } from "./components/Devtools";
import Game from "./Game";
import { getCurrentSave, getDefaultSave, loadSave } from "./save";

const App = () => {
   const maskRef = useRef(null);

   let saveData = getCurrentSave();
   if (saveData === null) {
      saveData = getDefaultSave();
   }
   loadSave(saveData);
   
   useEffect(() => {
      // Set up the tick shenanigans
      setInterval(() => Game.tick(), 1000 / Game.tps);

      document.addEventListener("keydown", event => {
         const key = event.key;

         // When ` is pressed, open the devtools
         if (key === "`" && process.env.NODE_ENV === "development") {
            if (toggleDevtools !== null) toggleDevtools();
         }
      });

      const mask = maskRef.current! as HTMLElement;
      mask.addEventListener("click", () => {
         if (Game.maskClickEvent) Game.maskClickEvent();
      });
   }, []);

   return <>
      <div id="version-text">Version {Game.version}</div>

      <Devtools />

      <Main />

      <div ref={maskRef} id="mask" className="hidden"></div>
   </>;
}

export default App;
