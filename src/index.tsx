import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Game from "./Game";
import { getElem } from "./utils";
import { loadSave } from "./save";
import { setupApplications } from "./applications";
import { setupStartMenu } from "./start-menu";
import { initialisePrograms, setupPrograms } from "./programs";
import { setupCorporateOverview } from "./corporate-overview";
import { generateLetterHashes, setupMail } from "./mail";
import { devtoolsIsOpen, hideDevtools, openDevtools, setupDevtools } from "./devtools";

ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const viewNames: string[] = ["computer", "mail", "corporate-overview", "settings"];
const setupViews = (): void => {
   // Hide all views except the computer and setup the buttons
   for (const name of viewNames) {
      const button = getElem(`${name}-button`);
      button.addEventListener("click", () => switchView(name));

      if (name === "computer") continue;

      getElem(name).classList.add("hidden");
      button.classList.add("dark");
   }
}
export function switchView(viewName: string): void {
   if (Game.isInFocus) return;

   const previouslyShownView = document.querySelector(".view:not(.hidden)");
   if (previouslyShownView) previouslyShownView.classList.add("hidden");

   const previouslySelectedButton = document.querySelector(".view-button:not(.dark)");
   if (previouslySelectedButton) previouslySelectedButton.classList.add("dark");

   getElem(viewName).classList.remove("hidden");
   getElem(`${viewName}-button`).classList.remove("dark");
}

const updateViewSizes = () => {
   const views: HTMLElement[] = Array.from(document.getElementsByClassName("view") as HTMLCollectionOf<HTMLElement>);
   const height = window.innerHeight - (getElem("top-bar") as HTMLElement).offsetHeight;
   for (const view of views) {
      view.style.height = `${height}px`;
   }
};
window.onload = () => {
   // Generate unique letter ID's based on their names.
   generateLetterHashes();

   initialisePrograms();

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

   setupPrograms();

   // Hide all views other than the computer
   setupViews();

   // Setup mail
   setupMail();

   // Setup the corporate overview
   setupCorporateOverview();

   // Sets up the mask click event handler
   Game.setupMask();

   // Calculates the lorem made by workers while away and adds it to the lorem count
   Game.calculateIdleProfits();

   Game.loadLoremAchievements();

   setupDevtools();
};

let keysDown: number[] = [];
let currentLoremIndex: number = 0;
const typeLorem = (key: string) => {
   const loremContainer = getElem("lorem-container");

   if (currentLoremIndex === 0) {
      loremContainer.innerHTML = "";
   }

   const loremTemplate: string = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aliquid! Officia amet adipisci porro repellat deserunt vero quos ad id sint dolore iure odio reprehenderit dolores sed, molestias vitae dicta! ";
   const currentLetter = loremTemplate[currentLoremIndex++ % loremTemplate.length];

   if (loremContainer) loremContainer.innerHTML += currentLetter;

   const loremGainChances = [
      {
         amount: 0.05,
         chance: 0.2
      },
      {
         amount: 0.3,
         chance: 0.1
      },
      {
         amount: 2,
         chance: 0.03
      }
   ]
   for (const gainChance of loremGainChances) {
      if (Math.random() <= gainChance.chance) {
         Game.lorem += gainChance.amount;
         break;
      }
   }
}
document.addEventListener("keydown", event => {
   const keyCode: number = event.keyCode;

   // When ` is pressed, open the devtools
   if (keyCode === 192 && process.env.NODE_ENV === "development") {
      if (devtoolsIsOpen()) {
         hideDevtools();
      } else {
         openDevtools();
      }
   }

   // If the input is a number from 1-9 (keycodes 49-57) and the command key isn't held and the view exists
   if (keyCode >= 49 && keyCode <= 57 && !event.metaKey && keyCode - 49 < viewNames.length) {
      switchView(viewNames[keyCode - 49]);
   }

   // When any letter key or the space bar is pressed
   if (((keyCode >= 65 && keyCode <= 90) || keyCode === 32) && !keysDown.includes(keyCode)) {
      keysDown.push(keyCode)
      const key = String.fromCharCode(keyCode)
      typeLorem(key);
   }
});
document.addEventListener("keyup", function(event) {
   const keyCode: number = event.keyCode;
   keysDown.splice(keysDown.indexOf(keyCode), 1);
});