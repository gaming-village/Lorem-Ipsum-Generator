import React from "react";
import Main from "./components/Main";
import Game from "./Game";

function App() {
   return <>
      <div id="version-text">Version {Game.version}</div>
      <Main />

      <div id="mask" className="hidden"></div>
   </>;
}

export default App;
