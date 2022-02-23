import React, { useEffect } from 'react';
import { NotificationContainer } from '../notifications';
import BlackMarket from '../components/BlackMarket';
import Button from '../components/Button';
import ButtonContainer from '../components/ButtonContainer';
import Computer from '../components/Computer';
import CorporateOverview from '../components/CorporateOverview';
import Mail from '../components/Mail';
import Navbar, { setupNavBar, switchView } from '../components/Navbar';
import WelcomeScreen, { previewType, showWelcomeScreen } from '../components/WelcomeScreen';
import WindowsProgram from '../components/WindowsProgram';
import { getElem, setupAudio } from '../utils';
import { devtoolsIsOpen, hideDevtools, openDevtools, setupDevtools } from '../devtools';
import Game from '../Game';
import { setupMail } from '../mail';
import { getCurrentSave } from '../save';
import { setupApplications } from '../applications';
import LoremCounter from '../classes/applications/LoremCounter';
import { setupStartMenu } from '../start-menu';
import { setupPrograms } from '../programs';
import { type } from '../components/LoremProductionSystem';

import '../css/pages/home.css';

export function focusProgram(program: HTMLElement): void {
   if (program === null) return;

   const previouslySelectedProgram = document.querySelector(".windows-program.in-focus");
   if (previouslySelectedProgram) previouslySelectedProgram.classList.remove("in-focus");

   program.classList.add("in-focus");
}

const Home = () => {
   const updateViewSizes = () => {
      const views: HTMLElement[] = Array.from(document.getElementsByClassName("view") as HTMLCollectionOf<HTMLElement>);
      const height = window.innerHeight - (getElem("top-bar") as HTMLElement).offsetHeight;
      for (const view of views) {
         view.style.height = `${height}px`;
      }
   };

   useEffect(() => {
      updateViewSizes();
      window.addEventListener("resize", () => {
         updateViewSizes();
      });
      
      setupApplications();
      
      const saveData = getCurrentSave();
      if (saveData === null) showWelcomeScreen();
      
      setupStartMenu();
      
      setupPrograms();
      
      setupNavBar();
      
      // Setup mail
      setupMail();
      
      // Sets up the mask click event handler
      Game.setupMask();
      
      // Calculates the lorem made by workers while away and adds it to the lorem count
      Game.calculateIdleProfits();
      
      Game.loadLoremAchievements();
      
      setupDevtools();
      
      setupAudio();

      // Create a list of all keys which generate lorem when typed.
      const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const ALL_LOREM_CHARS = ALL_LETTERS.concat([" ", "."]);

      let keysDown: Array<string> = [];
      document.addEventListener("keydown", event => {
         const key = event.key;

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
         if (VIEW_NUMS.includes(key)) {
            if (Game.isInFocus) return;

            // On mac if the command key is pressed (switch tab) don't fire
            if (window.navigator.appVersion.indexOf("Mac") !== -1 && event.metaKey) return;
            // On windows if the ctrl key is pressed (switch tab) don't fire
            else if (window.navigator.appVersion.indexOf("Win") !== -1 && event.ctrlKey) return;
            
            switchView(Number(key) - 1);
         }

         // When any letter key or the space bar is pressed
         if (ALL_LOREM_CHARS.includes(key) && !keysDown.includes(key)) {
            if (previewType !== null) {
               previewType();
               return;
            }
            keysDown.push(key)
            type();

            if (typeof Game.applications.loremCounter !== "undefined") (Game.applications.loremCounter as LoremCounter).createTextEffect!();
         }
      });
      document.addEventListener("keyup", function(event) {
         const key = event.key;
         keysDown.splice(keysDown.indexOf(key), 1);
      });

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
   }, []);

   return <>
      <WelcomeScreen />

      <WindowsProgram id="devtools" className="hidden" title="Devtools" titleIconSrc={require("../images/icons/settings.png").default}>
         <>
            <h2 className="resources">Resources</h2>

            <div className="resources-tab">
               <p>Add or set the lorem count.</p>
               <input className="lorem-input" />
               <ButtonContainer>
                  <>
                     <Button className="add-lorem">Add</Button>
                     <Button className="set-lorem">Set</Button>
                  </>
               </ButtonContainer>
            </div>

            <h2 className="mail">Mail</h2>

            <div className="mail-tab">
               <p>Receive letter</p>

               <select className="letter-select" name="Letters"></select>

               <Button className="receive-letter-button">Receive</Button>

               <p>Receive all letters</p>
               <Button className="receive-all-letters-button">Receive all</Button>
            </div>

            <h2 className="data">Data</h2>

            <div className="data-tab">
               <Button className="reset-button" isCentered={true}>Reset</Button>
            </div>
         </>
      </WindowsProgram>

      <NotificationContainer />

      <Navbar />
      
      <Computer />
      <Mail />
      <CorporateOverview />
      <BlackMarket />
   </>;
}

export default Home;