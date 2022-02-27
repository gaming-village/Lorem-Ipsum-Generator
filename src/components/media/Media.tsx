import { useCallback, useEffect, useState } from "react";

import Button from "../Button";
import TitleBar from "../TitleBar";
import Mail from "./Mail";

import Game from "../../Game";
import { LetterInfo } from "../../data/letter-data";

import "../../css/media.css";
import { switchView } from "../Navbar";

export let forceOpenLetter: ((letter: LetterInfo) => void) | null = null;

enum State {
   home,
   mail
}

let letterToForceOpen: LetterInfo | null = null;
const Media = () => {
   const [currentState, setCurrentState] = useState<State>(State.home);

   const openMail = useCallback(() => {
      Game.isInFocus = true;
      Game.showMask();
      Game.maskClickEvent = closeMail;
      
      setCurrentState(State.mail);
   }, []);

   useEffect(() => {
      forceOpenLetter = (letter: LetterInfo): void => {
         switchView("media");

         letterToForceOpen = letter;
         openMail();
      }
   }, [openMail]);

   const closeMail = (): void => {
      Game.isInFocus = false;
      Game.hideMask();
      Game.maskClickEvent = undefined;
      
      setCurrentState(State.home);
   }

   let content: JSX.Element | undefined;
   switch (currentState) {
      case State.mail: {
         content = <Mail defaultLetter={letterToForceOpen !== null ? letterToForceOpen : undefined} closeFunc={closeMail} />;
         break;
      }
   }

   return <div id="media" className="view">
      <div id="open-mail" className="windows-program">
         <TitleBar title="View Mail" uiButtons={[]} isDraggable={false} />
         <p>View all mail you have received.</p>
         
         <Button onClick={openMail} isCentered={true}>Open Mail</Button>
      </div>

      {content}
   </div>;
}

export default Media;