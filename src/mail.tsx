import React from "react";
import Game from "./Game";
import { createLineTrail, getElem, hashCode } from "./utils";
import LETTERS, { LetterInfo, LetterReward } from "./data/letters-data";
import { createNotification } from "./notifications";
import { switchView } from ".";

export const mail = {
   currentLetter: undefined as unknown as LetterInfo,
   receivedLetter: undefined as unknown as LetterInfo,
   updateMailEvent: undefined as unknown as Function,
   currentSelectedFolder: "inbox" as string
}

interface FolderInfo {
   id: string;
   name: string;
   iconSrc: string;
   isOpenByDefault: boolean;
}

const mailFolders = [
   {
      id: "inbox",
      name: "Inbox",
      iconSrc: "folder.png",
      isOpenByDefault: true
   },
   {
      id: "junkMail",
      name: "Junk Mail",
      iconSrc: "folder.png",
      isOpenByDefault: false
   },
   {
      id: "deletedItems",
      name: "Deleted Items",
      iconSrc: "folder.png",
      isOpenByDefault: false
   }
] as FolderInfo[];

export function claimReward(letterInfo: LetterInfo): void {
   if (!letterInfo.reward) {
      console.warn(`Letter '${letterInfo.subject}' does not have a reward.`);
      return;
   }

   const letterReward: LetterReward = letterInfo.reward;
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
   if (!letterIsAlreadyOpened(letter)) {
      closeInbox();
      return;
   }

   letterInfo.isOpened = true;

   mail.currentLetter = letterInfo;
   mail.updateMailEvent();

   updateMailFolder(letterInfo.folder);
}

const getLetter = (letterInfo: LetterInfo): HTMLElement => {
   const letterNumber = LETTERS.indexOf(letterInfo);
   const letter = getElem("inbox").querySelector(`.letter-${letterNumber}`);

   if (letter !== null) {
      return letter as HTMLElement;
   }
   throw new Error(`Couldn't find a letter with a class of '.letter-${letterNumber}'.`);
}
const openInboxLetter = (letterInfo: LetterInfo, letterRef: HTMLElement | number): void => {
   // const letter: HTMLElement = getElem("inbox").querySelector(`.letter-${letterNumber}`) as HTMLElement;
   let letter: HTMLElement;
   if (typeof letterRef === "number") {
      letter = getElem("inbox").querySelector(`.letter-${letterRef}`) as HTMLElement;
   } else {
      letter = letterRef;
   }
   const previouslyOpenedLetter = getElem("inbox").querySelector(".letter.opened") as HTMLElement;

   if (previouslyOpenedLetter === letter) {
      letter?.classList.remove("opened");
      openLetter(letter, letterInfo);
      return;
   }
   
   previouslyOpenedLetter?.classList.remove("opened");
   letter.classList.remove("unopened");
   letter.classList.add("opened");

   openLetter(letter, letterInfo);
}

const createInboxLetter = (letterInfo: LetterInfo, letterNumber: number): JSX.Element => {
   const letterClass = `letter letter-${letterNumber}${!letterInfo.isOpened ? " unopened" : ""}${letterInfo === mail.currentLetter ? " opened" : ""}`;
   const imgSrc = require("./images/icons/letter.png").default;
   
   const letter = <div onClick={() => openInboxLetter(letterInfo, letterNumber)} className={letterClass} key={letterNumber}>
      <div className="icon-container">
         <img src={imgSrc} alt="" />
      </div>
      <div>
         <span>{letterInfo.from}</span>
      </div>
      <div>
         <span>{letterInfo.subject}</span>
      </div>
   </div>;

   return letter;
}

export function getInboxMail(): JSX.Element[] {
   const inboxLetters: JSX.Element[] = [];
   for (let i = 0; i < LETTERS.length; i++) {
      const letterInfo = LETTERS[i];
      if (letterInfo.folder === mail.currentSelectedFolder && letterInfo.isReceived) {
         const inboxLetter = createInboxLetter(letterInfo, i);
         inboxLetters.push(inboxLetter);
      }
   }

   return inboxLetters;
}

let folderListener: Function;
export function createFolderListener(func: Function): void {
   folderListener = func;
}

const getFolderInfo = (folderName: string): FolderInfo | undefined => {
   for (const folderInfo of mailFolders) {
      if (folderInfo.id === folderName) {
         return folderInfo;
      }
   }
}
const getFolder = (folderName: string): HTMLElement => {
   const folderInfo = getFolderInfo(folderName) as FolderInfo;
   return getElem("inbox").querySelector(`.${folderInfo.id}-folder`) as HTMLElement;
}
const openFolder = (folderName: string): void => {
   const folder = getFolder(folderName);
   const folderInfo = getFolderInfo(folderName) as FolderInfo;
   const previouslySelectedFolder = getElem("inbox").querySelector(".folder:not(.root-folder).opened");
   if (previouslySelectedFolder === folder) return;
   if (previouslySelectedFolder) previouslySelectedFolder.classList.remove("opened");
   
   folder.classList.add("opened");
   mail.currentSelectedFolder = folderInfo.id;
   folderListener();
}

const mailFolderHasUnopened = (folderID: string): boolean => {
   // Get the letters which belong to the folder
   const folderLetters = LETTERS.filter(letterInfo => letterInfo.folder === folderID);

   for (const folder of folderLetters) {
      if (folder.isReceived && !folder.isOpened) {
         return true;
      }
   }
   return false;
}

const updateMailFolder = (folderID: string): void => {
   const hasUnopenedLetters = mailFolderHasUnopened(folderID);

   const folder = getElem("inbox").querySelector(`.${folderID}-folder`) as HTMLElement;
   if (hasUnopenedLetters) folder.classList.add("has-unopened-letters");
   else folder.classList.remove("has-unopened-letters");
}

const createMailFolders = (): void => {
   const folderContainer = getElem("inbox").querySelector(".folder-container");

   // Main trail
   createLineTrail(folderContainer as HTMLElement, { x: 10, y: 12 }, { x: 10, y: mailFolders.length * 24 + 12 });

   for (let i = 0; i < mailFolders.length; i++) {
      const folderInfo = mailFolders[i];

      const hasUnopenedLetters = mailFolderHasUnopened(folderInfo.id);

      const folder = document.createElement("div");
      folder.className = `folder${folderInfo.isOpenByDefault ? " opened" : ""} ${folderInfo.id}-folder${hasUnopenedLetters ? " has-unopened-letters" : ""}`;
      folder.innerHTML = `
      <div class="icon"></div>
      <span>${folderInfo.name}</span>`;
      folderContainer?.appendChild(folder);

      updateMailFolder(folderInfo.id);

      folder.addEventListener("click", () => openFolder(folderInfo.id));

      // Side trails
      const startPos = {
         x: 10,
         y: i * 24 + 36
      }
      const endPos = {
         x: 30,
         y: i * 24 + 36
      }
      createLineTrail(folderContainer as HTMLElement, startPos, endPos);
   }
}

const closeMail = (): void => {
   Game.isInFocus = false;
   Game.hideMask();

   getElem("mail-container").classList.add("hidden");
}

export function openMail(): void {
   Game.isInFocus = true;
   Game.showMask();
   Game.maskClickEvent = closeMail;

   getElem("mail-container").classList.remove("hidden");
}

let receiveMailEvent: Function;
export function createMailReceiveEvent(func: Function): void {
   receiveMailEvent = func;
}
export function receiveMail(letterName: string): void {
   let letterInfo: LetterInfo = undefined as unknown as LetterInfo;
   for (const currentLetterInfo of LETTERS) {
      if (currentLetterInfo.name === letterName) {
         letterInfo = currentLetterInfo;
         break;
      }
   }
   if (letterInfo.isReceived) return;

   const notificationInfo = {
      iconSrc: "folder.png",
      title: letterInfo.subject,
      description: "You've got mail!",
      caption: "Click to open"
   };
   const notificationClickEvent = (notification: HTMLElement) => {
      notification.remove();
      
      switchView("mail");
      openMail();

      openFolder((getFolderInfo(letterInfo.folder) as FolderInfo).id);

      // Without the settimeout, getLetter(letterInfo) returns undefined as the openFolder function above is async...
      // Really fuckin shitty solution but it works?
      setTimeout(() => {
         openInboxLetter(letterInfo, getLetter(letterInfo));
      }, 1);
   }
   createNotification(notificationInfo, true, true, notificationClickEvent);

   // Find an available letter number
   const letterNumber = LETTERS.indexOf(letterInfo);

   letterInfo.isReceived = true;
   createInboxLetter(letterInfo, letterNumber);

   updateMailFolder(letterInfo.folder);
   
   mail.receivedLetter = letterInfo;
   if (receiveMailEvent) receiveMailEvent();
}

export function generateLetterHashes(): void {
   for (const letterInfo of LETTERS) {
      const hash = hashCode(letterInfo.name);
      letterInfo.hashID = hash;
   }
}

export function setupMail(): void {
   // Create the folder system for the inbox
   createMailFolders();

   folderListener();
}