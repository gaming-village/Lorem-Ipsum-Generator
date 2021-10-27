import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Game from "./Game";
import { getElem } from "./utils";
import { getCurrentSave, getDefaultSave } from "./save";
import { setupApplications } from "./applications";
import { setupStartMenu } from "./start-menu";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const loadSave = () => {
   let saveData = getCurrentSave();
   if (saveData === null) {
      saveData = getDefaultSave();
   }

   const sections: string[] = saveData.split("|");
   for (let i: number = 0; i < sections.length; i++) {
      const section: string = sections[i];

      switch (i) {
         case 0: {
            // Lorem count

            const parts: string[] = section.split("_");

            Game.lorem = Number(parts[0]);
         }
      }
   }
};
const updateViewSizes = () => {
   const views: HTMLElement[] = Array.from(document.getElementsByClassName("view") as HTMLCollectionOf<HTMLElement>);
   const height = window.innerHeight - (getElem("top-bar") as HTMLElement).offsetHeight;
   for (const view of views) {
      view.style.height = `${height}px`;
   }
};
window.onload = () => {
   // Load any saved games. If there aren't any, use the default save
   loadSave();

   updateViewSizes();
   window.addEventListener("resize", () => {
      updateViewSizes();
   });

   // Set up the tick shenanigans
   setInterval(() => Game.tick(), 1000 / Game.tps);

   // Display the lorem count everywhere
   Game.updateLorem();

   setupApplications();

   setupStartMenu();
};

let keysDown: number[] = [];
let currentLoremIndex: number = 0;
const typeLorem = (key: string) => {
   const loremTemplate: string = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aliquid! Officia amet adipisci porro repellat deserunt vero quos ad id sint dolore iure odio reprehenderit dolores sed, molestias vitae dicta! ";
   const currentLetter = loremTemplate[currentLoremIndex++ % loremTemplate.length];

   const loremContainer = getElem("lorem-container");
   if (loremContainer) loremContainer.innerHTML += currentLetter;

   Game.lorem += 0.05;
}
document.addEventListener("keydown", event => {
   const keyCode: number = event.keyCode;

   // When any letter key is pressed
   if (keyCode >= 65 && keyCode <= 90 && !keysDown.includes(keyCode)) {
      keysDown.push(keyCode)
      const key = String.fromCharCode(keyCode)
      typeLorem(key);
   }
});
document.addEventListener("keyup", function(event) {
   const keyCode: number = event.keyCode;
   keysDown.splice(keysDown.indexOf(keyCode), 1);
});