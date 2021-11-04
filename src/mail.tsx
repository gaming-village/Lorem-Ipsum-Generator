import React from "react";
import ReactDOM from "react-dom";
import UIButton from "./components/UIButton";
import Game from "./Game";
import { getElem } from "./utils";

interface LetterReward {
   name: string;
   imgSrc: string;
   rewardOnClaim: Function;
   isClaimed: boolean;
}

interface LetterInfo {
   name: string;
   subject: string;
   from: string;
   body: JSX.Element;
   reward?: LetterReward;
   isCloseable: boolean;
}

export const mail = {
   currentLetter: undefined as unknown as LetterInfo,
   updateMailEvent: undefined as unknown as Function,
   letters: [
      {
         name: "test",
         subject: "Test",
         from: "obama",
         body: <>
            <p>Greetings from Australia.</p>
            <p>I am gaming rn</p>
         </>,
         isCloseable: false
      },
      {
         name: "aaaaa",
         subject: "aaaa",
         from: "test2",
         body: <>
            <p>test1</p>
            <p>test2</p>
            <p>test3 TEST3</p>
         </>,
         reward: {
            name: "10 Lorem",
            imgSrc: "icons/scroll.png",
            rewardOnClaim: () => {
               Game.lorem = 0;
            },
            isClaimed: false
         },
         isCloseable: true
      },
      {
         name: "long",
         subject: "looooong boi",
         from: "tall chad",
         body: <>
            <p>HEAD</p>
            <p>neck</p>
            <p>neck</p>
            <p>body</p>
            <p>body</p>
            <p>body</p>
            <p>body</p>
            <p>feet</p>
         </>,
         isCloseable: true
      }
   ] as LetterInfo[]
}

export function claimReward(letterInfo: LetterInfo): void {
   const letterReward = letterInfo.reward as LetterReward;
   letterReward.isClaimed = true;

   mail.updateMailEvent();
}

const letterIsAlreadyOpened = (letter: HTMLElement): boolean => {
   return letter.classList.contains("opened");
}

const closeInbox = (): void => {
   mail.currentLetter = undefined as unknown as LetterInfo;
   mail.updateMailEvent();
}

const openLetter = (letter: HTMLElement, letterInfo: LetterInfo): void => {
   // Don't open the letter if the user clicked the close button
   const e = (window.event as PointerEvent);
   if (e.target !== letter) return;

   if (letterIsAlreadyOpened(letter)) {
      letter.classList.remove("opened");
      closeInbox();
      return;
   }

   const previouslyOpenedLetter = getElem("inbox").querySelector(".letter.opened");
   if (previouslyOpenedLetter) previouslyOpenedLetter.classList.remove("opened");

   letter.classList.add("opened");

   mail.currentLetter = letterInfo;
   mail.updateMailEvent();
}

const closeLetter = (letter: HTMLElement): void => {
   if (letterIsAlreadyOpened(letter)) {
      closeInbox();
   }

   letter.remove();
}

const createLetter = (letterInfo: LetterInfo, inbox: HTMLElement): void => {
   const letter = document.createElement("div");
   letter.className = "letter";
   inbox.appendChild(letter);

   letter.innerHTML = `
   <div class="close-button-container"></div>
   <div class="title">${letterInfo.subject}</div>
   <div class="from">${letterInfo.from}</div>`;

   // Letter click event
   letter.addEventListener("click", () => openLetter(letter, letterInfo));

   // Close button
   const clickEvent = () => {
      if (letterInfo.isCloseable) closeLetter(letter);
   }
   const closeButton = <UIButton onClick={clickEvent} isClickable={!letterInfo.isCloseable} type="close" />;
   ReactDOM.render(closeButton, letter.querySelector(".close-button-container"));
}

const fillInbox = (): void => {
   const inbox = getElem("inbox");
   for (const letterInfo of mail.letters) {
      createLetter(letterInfo, inbox);
   }
}

const closeMail = (): void => {
   Game.isInFocus = false;
   Game.hideMask();

   getElem("mail-container").classList.add("hidden");
}

const openMail = (): void => {
   Game.isInFocus = true;
   Game.showMask();
   Game.maskClickEvent = closeMail;

   getElem("mail-container").classList.remove("hidden");
}

export function setupMail(): void {
   getElem("mail-opener").addEventListener("click", openMail);

   fillInbox();
}