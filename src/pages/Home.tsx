import { useEffect } from 'react';

import { NotificationContainer } from '../notifications';
import BlackMarket from '../components/BlackMarket';
import Media from '../components/media/Media';
import Computer from '../components/Computer';
import CorporateOverview from '../components/corporate-overview/CorporateOverview';
import Navbar, { setupNavBar, switchView } from '../components/Navbar';
import WelcomeScreen, { previewType, showWelcomeScreen } from '../components/WelcomeScreen';

import Game, { checkLoremLetters } from '../Game';
import { getCurrentSave } from '../save';
import { setupApplications } from '../applications';
import { setupStartMenu } from '../start-menu';
import { setupPrograms } from '../programs';
import { type } from '../components/LoremProductionSystem';
import { updateInternMotivation } from '../classes/applications/AchievementTracker';

import '../css/pages/home.css';
import '../css/popups.css';
import "../css/applications.css";
import "../css/terminal.css";

export function focusProgram(program: HTMLElement): void {
   if (program === null) return;

   const previouslySelectedProgram = document.querySelector(".windows-program.in-focus");
   if (previouslySelectedProgram) previouslySelectedProgram.classList.remove("in-focus");

   program.classList.add("in-focus");
}

const keysDown = new Array<string>();

// Create a list of all keys which generate lorem when typed.
const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ALL_LOREM_CHARS = ALL_LETTERS.concat([" ", "."]);
const onKeyDown = (): void => {
   const event = window.event as KeyboardEvent;
   const key = event.key;

   // Close focus when the Escape key is pressed
   if (key === "Escape" && Game.isInFocus) {
      Game.maskClickEvent!();
   }

   // If the input is a number from 1-9 (keycodes 49-57) and the command key isn't held and the view exists
   const VIEW_NUMS = "123456789".split("");
   if (VIEW_NUMS.includes(key)) {
      if (Game.isInFocus) return;
      
      const activeElementType = document.activeElement?.tagName;
      if (typeof activeElementType !== "undefined") {
         if (activeElementType === "INPUT") return;
      }

      // On mac if the command key is pressed (switch tab) don't fire
      if (window.navigator.appVersion.indexOf("Mac") !== -1 && event.metaKey) return;
      // On windows if the ctrl key is pressed (switch tab) don't fire
      if (window.navigator.appVersion.indexOf("Win") !== -1 && event.ctrlKey) return;
      
      switchView(Number(key) - 1);
   }

   // When any letter key or the space bar is pressed
   if (ALL_LOREM_CHARS.includes(key) && !keysDown.includes(key) && Game.currentView === "computer") {
      // The typing practice section from the Welcome Screen
      if (previewType !== null) {
         previewType();
         return;
      }

      if (!Game.isInFocus) {
         keysDown.push(key)
         type(key);
      }
   }
}

const mouseDown = (): void => {
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
      if (previouslySelectedProgram !== null) previouslySelectedProgram.classList.remove("in-focus");
   }

   for (const target of e.composedPath()) {
      const elem = target as HTMLElement;
      if (typeof elem.classList !== "undefined" && elem.classList.contains("windows-program")) {
         focusProgram(elem);
         break;
      }
   }
}

const keyUp = (): void => {
   const event = window.event as KeyboardEvent;
   const key = event.key;
   keysDown.splice(keysDown.indexOf(key), 1);
}

const updateViewSizes = () => {
   const views: HTMLElement[] = Array.from(document.getElementsByClassName("view") as HTMLCollectionOf<HTMLElement>);

   const topBar = document.getElementById("top-bar");
   if (topBar === null) return;
   const height = window.innerHeight - topBar.offsetHeight;
   for (const view of views) {
      view.style.height = `${height}px`;
   }
};

const Home = () => {
   useEffect(() => {
      setupApplications();
      
      const saveData = getCurrentSave();
      if (saveData === null) showWelcomeScreen();
      
      setupStartMenu();
      
      setupPrograms();
      
      setupNavBar();

      checkLoremLetters();

      updateInternMotivation();
      
      Game.loadLoremAchievements();

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", keyUp);
      document.addEventListener("mousedown", mouseDown);

      updateViewSizes();
      window.addEventListener("resize", () => updateViewSizes());

      return () => {
         document.removeEventListener("keydown", onKeyDown);
         document.removeEventListener("keyup", keyUp);
         document.removeEventListener("mousedown", mouseDown);

         window.removeEventListener("resize", updateViewSizes);
      }
   }, []);

   return <>
      <WelcomeScreen />

      <NotificationContainer />

      <Navbar />
      
      <Computer />
      <Media />
      <CorporateOverview />
      <BlackMarket />
   </>;
}

export default Home;