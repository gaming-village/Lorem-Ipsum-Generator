import Game from "./Game";
import "./css/devtools.css";
import { getElem } from "./utils";
import letters from "./data/letters-data";
import { receiveMail } from "./mail";

const devtoolTabNames: string[] = ["resources", "mail", "data"];

const tabIsOpen = (name: string): boolean => {
   return !getElem("devtools").querySelector(`.${name}-tab`)?.classList.contains("hidden");
}

const getTab = (name: string): HTMLElement => {
   const tab = getElem("devtools").querySelector(`.${name}-tab`);
   return tab as HTMLElement;
}
const getTabHeader = (name: string): HTMLElement => {
   const header = getElem("devtools").querySelector(`.${name}`);
   return header as HTMLElement;
}

const closeTab = (name: string): void => {
   const tab = getTab(name);
   tab.classList.add("hidden");

   const tabHeader = getTabHeader(name);
   tabHeader.classList.remove("opened");
}

const closeAllTabs = (): void => {
   for (const name of devtoolTabNames) {
      closeTab(name);
   }
}

const openTab = (name: string): void => {
   const tab = getTab(name);
   tab.classList.remove("hidden");

   const tabHeader = getTabHeader(name);
   tabHeader.classList.add("opened");
}

const createClickEvents = () => {
   for (const name of devtoolTabNames) {
      const header = getTabHeader(name);

      header?.addEventListener("click", () => {
         if (tabIsOpen(name)) {
            closeTab(name);
         } else {
            openTab(name);
         }
      });
   }
}

export function devtoolsIsOpen() {
   return !getElem("devtools").classList.contains("hidden");
}

export function hideDevtools(): void {
   Game.isInFocus = false;
   Game.hideMask();

   getElem("devtools").classList.add("hidden");
}

export function openDevtools(): void {
   if (Game.isInFocus) return;

   Game.isInFocus = true;
   Game.showMask();
   Game.maskClickEvent = hideDevtools;

   getElem("devtools").classList.remove("hidden");
}


export function setupDevtools(): void {
   // Close all tabs
   closeAllTabs();
   
   // Create the h2 click events to close and open the tabs
   createClickEvents();

   const devtools = getElem("devtools");

   devtools.querySelector(".ui-minimize")?.addEventListener("click", hideDevtools);

   devtools.querySelector(".add-lorem")?.addEventListener("click", () => {
      const input = (devtools.querySelector(".lorem-input") as HTMLInputElement).value;
      Game.lorem += Number(input);
   });

   devtools.querySelector(".set-lorem")?.addEventListener("click", () => {
      const input = (devtools.querySelector(".lorem-input") as HTMLInputElement).value;
      Game.lorem = Number(input);
   });

   devtools.querySelector(".reset-button")?.addEventListener("click", () => {
      Game.reset();
   });

   const letterSelect = devtools.querySelector(".letter-select") as HTMLOptionElement;
   for (const letter of letters) {
      const option = document.createElement("option");
      option.value = letter.name;
      option.text = letter.subject;
      letterSelect.appendChild(option);
   }

   const receiveLetterButton = devtools.querySelector(".receive-letter-button") as HTMLElement;
   receiveLetterButton.addEventListener("click", () => {
      const value = letterSelect.value;
      receiveMail(value);
   });

   const receiveAllLettersButton = devtools.querySelector(".receive-all-letters-button") as HTMLElement;
   receiveAllLettersButton.addEventListener("click", () => {
      for (const letter of letters) {
         receiveMail(letter.name);
      }
   })
}