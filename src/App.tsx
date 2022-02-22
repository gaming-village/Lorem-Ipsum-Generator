import React, { useEffect } from "react";
import Main from "./components/Main";
import Game from "./Game";
import { getCurrentSave, getDefaultSave, loadSave } from "./save";

function App() {
   let saveData = getCurrentSave();
   if (saveData === null) {
      saveData = getDefaultSave();
   }
   loadSave(saveData);
   
   useEffect(() => {
      // Set up the tick shenanigans
      setInterval(() => Game.tick(), 1000 / Game.tps);
   }, []);

   return <>
      <div id="version-text">Version {Game.version}</div>
      <Main />

      <div id="mask" className="hidden"></div>
   </>;
}

export default App;
