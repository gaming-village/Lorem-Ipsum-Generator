import React, { useEffect, useRef, useState } from 'react';
import Game from '../Game';
import WindowsProgram from './WindowsProgram';
import '../css/welcome-screen.css';
import { focusProgram } from "../pages/Home";
import Button from './Button';
import { getElem } from '../utils';

let show: (() => void) | null = null;
export let previewType: (() => void) | null = null;

export function showWelcomeScreen(): void {
   Game.showMask();
   Game.isInFocus = true;
   if (show !== null) show();
}

const closeWelcomeScreen = (): void => {
   Game.hideMask();
   Game.isInFocus = false;
}

interface SectionInfo {
   name: string;
   text: JSX.Element
}
const sections: ReadonlyArray<SectionInfo> = [
   {
      name: "Introduction",
      text: <>
         <p>Welcome intern.</p>
         <p>Congratulations on your entry into LoremCorp&trade;. You have been supplied with a virtual Windows 95 machine on which to conduct your mining.</p>
         <p>LoremCorp&trade; is the world's leading lorem production company, well known for its 'innovative' ethical practices.</p>
      </>
   },
   {
      name: "About",
      text: <>
         <p>As an intern, it is your duty to tirelessly produce lorem with no pay. Any behaviour which may be deemed 'unnecessary' will result in immediate disciplinary action.</p>
         <p>Lorem mining is conducted by using the letter keys on your assigned keyboard.</p>
         <p>You can practice mining lorem below.</p>
         <div className="text-box">
            <span className="placeholder-text">[Use your keys to type]</span>
         </div>
      </>
   },
   {
      name: "Parting message",
      text: <>
         <p>You are dispensable and will be removed if you step out of line.</p>
         <p>We hope you regret your stay,</p>
         <p><i>- LoremCorp LLC&trade;</i></p>
      </>
   }
];

enum Stages {
   hidden = 0,
   introduction = 1
}

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const WelcomeScreen = () => {
   const [stage, setStage] = useState<Stages>(Stages.hidden);
   const [section, setSection] = useState<number>(0);
   const [previewTextIndex, setPreviewTextIndex] = useState<number>(0);
   const welcomeScreenRef = useRef(null);

   useEffect(() => {
      show = () => {
         setStage(Stages.introduction);
         focusProgram(welcomeScreenRef.current!);
      }
   }, []);

   if (section === 1) {
      previewType = (): void => {
         setPreviewTextIndex(previewTextIndex + 1);
         
         const textBox = getElem("welcome-screen").querySelector(".text-box")!;
         textBox.innerHTML = lorem.substring(0, previewTextIndex + 1);
      }
   }

   const close = () => {
      closeWelcomeScreen();
      setStage(Stages.hidden);
      previewType = null;
   }

   return stage === Stages.hidden ? <></> : (
      <WindowsProgram ref={welcomeScreenRef} id="welcome-screen" title="Welcome" isAlwaysSelected>
         <h1 style={{ textAlign: "center" }}>Welcome to LoremCorp&trade;!</h1>

         <div className="formatter">
            <div className="section-text">
               {sections[section].text}
            </div>
            <div className="nav">
               {sections.map((currentSection, i) => {
                  const clickEvent = (): void => {
                     setSection(i);
                  }

                  return <Button isCentered isFlashing={i === section + 1} className={i !== section ? "dark" : ""} key={i} onClick={clickEvent}>{currentSection.name}</Button>
               })}

               <div className="separator"></div>

               <Button onClick={close} isFlashing={section === sections.length - 1} isCentered isDotted>Close</Button>
            </div>
         </div>
      </WindowsProgram>
   );
};

export default WelcomeScreen;
