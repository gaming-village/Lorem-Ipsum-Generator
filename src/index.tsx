import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import Game from "./Game";
import { getElem } from "./utils";
import { getCurrentSave, getDefaultSave, loadSave } from "./save";
import { setupApplications } from "./applications";
import { setupStartMenu } from "./start-menu";
import { setupPrograms } from "./programs";
import { loremCorp, setupCorporateOverview } from "./corporate-overview";
import { generateLetterHashes, setupMail } from "./mail";
import { devtoolsIsOpen, hideDevtools, openDevtools, setupDevtools } from "./devtools";
import { type } from "./lorem-production";
import { previewType, showWelcomeScreen } from "./components/WelcomeScreen";

ReactDOM.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>,
   document.getElementById("root")
);

const viewNames: string[] = ["computer", "mail", "corporate-overview"];
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

   let shouldShowWelcomeScreen = false;
   let saveData = getCurrentSave();
   if (saveData === null) {
      saveData = getDefaultSave();
      shouldShowWelcomeScreen = true;
   }
   loadSave(saveData);

   loremCorp.updateCorporateOverview();

   updateViewSizes();
   window.addEventListener("resize", () => {
      updateViewSizes();
   });

   setupApplications();

   if (shouldShowWelcomeScreen) showWelcomeScreen();

   // Set up the tick shenanigans
   setInterval(() => Game.tick(), 1000 / Game.tps);

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

let keysDown: Array<string> = [];
document.addEventListener("keydown", event => {
   const key = event.key;

   const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
   const ALL_LOREM_CHARS = ALL_LETTERS.concat([" "]);

   // When ` is pressed, open the devtools
   if (key === "`" && process.env.NODE_ENV === "development") {
      if (devtoolsIsOpen()) {
         hideDevtools();
      } else {
         openDevtools();
      }
   }

   // Close focus when the Escape key is pressed
   if (key === "Escape" && Game.isInFocus) {
      Game.maskClickEvent!();
   }

   // If the input is a number from 1-9 (keycodes 49-57) and the command key isn't held and the view exists
   const VIEW_NUMS = "123456789".split("");
   if (VIEW_NUMS.includes(key) && Number(key) <= viewNames.length) {
      // On mac if the command key is pressed (switch tab) don't fire
      if (window.navigator.appVersion.indexOf("Mac") !== -1 && event.metaKey) return;
      // On windows if the ctrl key is pressed (switch tab) don't fire
      else if (window.navigator.appVersion.indexOf("Win") !== -1 && event.ctrlKey) return;
      
      switchView(viewNames[Number(key) - 1]);
   }

   // When any letter key or the space bar is pressed
   if (ALL_LOREM_CHARS.includes(key) && !keysDown.includes(key)) {
      if (previewType !== null) {
         previewType();
         return;
      }
      keysDown.push(key)
      type(key);
   }
});
document.addEventListener("keyup", function(event) {
   const key = event.key;
   keysDown.splice(keysDown.indexOf(key), 1);
});

export function focusProgram(program: HTMLElement): void {
   const previouslySelectedProgram = document.querySelector(".windows-program.in-focus");
   if (previouslySelectedProgram) previouslySelectedProgram.classList.remove("in-focus");

   program.classList.add("in-focus");
}

document.addEventListener("mousedown", () => {
   const e = window.event!;

   let shouldHidePrevious = true;
   for (const target of e.composedPath()) {
      const elem = target as HTMLElement;
      if (elem.classList && elem.classList.contains("taskbar-icon")) {
         shouldHidePrevious = false;
         break;
      }
   }
   if (shouldHidePrevious) {
      const previouslySelectedProgram = document.querySelector(".windows-program.in-focus");
      if (previouslySelectedProgram) previouslySelectedProgram.classList.remove("in-focus");
   }

   for (const target of e.composedPath()) {
      const elem = target as HTMLElement;
      if (typeof elem.classList !== "undefined" && elem.classList.contains("windows-program")) {
         focusProgram(elem);
         break;
      }
   }
});