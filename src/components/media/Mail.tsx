import { useState } from "react";

import ScrollArea from "../ScrollArea";
import WindowsProgram from "../WindowsProgram";
import Section from "../Section";

import WhiteLetter from "../../images/icons/white-letter.png";
import RootFolder from "../../images/icons/folder-container.png";
import LetterImg from "../../images/icons/letter.png";

import LETTERS, { LetterInfo } from "../../data/letter-data";
import { createNotification } from "../../notifications";
import { forceOpenLetter } from "./Media";

interface FolderInfo {
   name: string;
}
const FOLDERS: ReadonlyArray<FolderInfo> = [
   {
      name: "Inbox"
   },
   {
      name: "Junk Mail"
   },
   {
      name: "Deleted Items"
   }
];

export function receiveLetter(letterSubject: string): void {
   // Find the corresponding letter using the letter subject
   let letter!: LetterInfo;
   for (const currentLetter of LETTERS) {
      if (currentLetter.subject === letterSubject) {
         letter = currentLetter;
         break;
      }
   }

   if (!letter.isReceived) {
      console.log(letter.subject);
      letter.isReceived = true;

      const clickEvent = (): void => {
         forceOpenLetter!(letter);
      }

      createNotification({
         iconSrc: "folder.png",
         title: letter.subject,
         description: "You've got mail!",
         caption: "Click to open",
         isClickable: true,
         hasCloseButton: true,
         onClick: clickEvent
      });
   }
}

/** Find a letter's folder */
const getLetterFolder = (letter: LetterInfo): FolderInfo => {
   let folder!: FolderInfo;
   for (const currentFolder of FOLDERS) {
      if (currentFolder.name === letter.folder) {
         folder = currentFolder;
         break;
      }
   }
   return folder;
}

const getLettersByFolder = (folder: FolderInfo): Array<LetterInfo> => {
   const folderLetters = new Array<LetterInfo>();
   for (const letter of LETTERS) {
      if (letter.isReceived && letter.folder === folder.name) {
         folderLetters.push(letter);
      }
   }
   return folderLetters;
}

/** If a folder has a letter which is unopened */
const folderHasUnopened = (folder: FolderInfo): boolean => {
   for (const letter of LETTERS) {
      if (letter.folder === folder.name && letter.isReceived && !letter.isOpened) {
         return true;
      }
   }
   return false;
}

interface LetterProps {
   letter: LetterInfo | null;
   closeFunc: () => void;
}
const Letter = ({ letter, closeFunc }: LetterProps) => {
   return <WindowsProgram id="letter" title={letter !== null ? letter.subject + " - Microsoft Exchange" : "Microsoft Exchange"} uiButtons={["close"]} closeFunc={() => closeFunc()}>
      {letter !== null ? <>
         <table>
            <tbody>
               <tr>
                  <td>From:</td>
                  <td>{letter.from}</td>
               </tr>
               <tr>
                  <td>To:</td>
                  <td>You</td>
               </tr>
               <tr>
                  <td>Subject:</td>
                  <td>{letter.subject}</td>
               </tr>
            </tbody>
         </table>

         <div id="letter-body" className="text-box">
            <h1>{letter.subject}</h1>

            {letter.body}

            <p>- {letter.from}</p>
         </div>

         <div id="reward-container" className="text-box">
            {typeof letter.reward !== "undefined" ? (
               <></>
            ) : (
               <p>This letter has no rewards!</p>
            )}
         </div>
      </> : <>
         <p className="select-notice">Select a letter to view its contents</p>
      </>}
   </WindowsProgram>;
}

interface MailProps {
   defaultLetter?: LetterInfo;
   closeFunc: () => void;
}
const Mail = ({ defaultLetter, closeFunc }: MailProps) => {
   const hasDefaultLetter = typeof defaultLetter !== "undefined";
   const [currentFolder, setCurrentFolder] = useState<FolderInfo>(hasDefaultLetter ? getLetterFolder(defaultLetter) : FOLDERS[0]);
   const [currentLetters, setCurrentLetters] = useState<Array<LetterInfo>>(getLettersByFolder(currentFolder));
   const [currentLetter, setCurrentLetter] = useState<LetterInfo | null>(hasDefaultLetter ? defaultLetter : null);

   if (hasDefaultLetter) {
      defaultLetter.isOpened = true;
   }

   const openFolder = (newFolder: FolderInfo): void => {
      setCurrentFolder(newFolder);
      setCurrentLetters(getLettersByFolder(newFolder));
   }

   const closeLetter = (): void => {
      setCurrentLetter(null);
   }

   const openLetter = (newLetter: LetterInfo): void => {
      newLetter.isOpened = true;

      setCurrentLetter(newLetter);
   }

   const folderTree = <>
      <div className="folder root-folder">
         <img src={RootFolder} className="icon" alt="" />
         <span>Microsoft Exchange</span>
      </div>

      {FOLDERS.map((folder, i) => {
         let iconSrc!: string;
         if (folder === currentFolder) {
            iconSrc = require("../../images/icons/opened-folder.png").default;
         } else {
            iconSrc = require("../../images/icons/folder.png").default;
         }

         let className = "folder";
         if (folder === currentFolder) className += " opened";
         if (folderHasUnopened(folder)) className += " has-unopened-letters";

         return <div onClick={() => openFolder(folder)} className={className} key={i}>
            <div className="icon">
               <img src={iconSrc} alt="" />
            </div>
            <span>{folder.name}</span>
         </div>;
      })}
   </>;

   const letters = currentLetters.map((letter, i) => {
      let className = "letter";
      if (!letter.isOpened) className += " unopened";
      if (letter === currentLetter) className += " opened";
      return <div onClick={() => openLetter(letter)} className={className} key={i}>
         <div className="icon-container">
            <img src={LetterImg} alt="" />
         </div>
         <div>
            <span>{letter.subject}</span>
         </div>
         <div>
            <span>{letter.from}</span>
         </div>
      </div>;
   });

   const letterElem = <Letter letter={currentLetter} closeFunc={closeLetter} />
   
   return <>
      <WindowsProgram id="inbox" title="Inbox" uiButtons={["minimize"]} minimizeFunc={() => closeFunc()}>
         <div className="formatter">
            <div className="folder-container text-box">
               {folderTree}
            </div>
            <ScrollArea scrollType="vertical">
               <div className="ui-section-container">
                  <Section content={<img src={WhiteLetter} alt="" />} fillType="shrink" />
                  <Section content="From" fillType="fill" />
                  <Section content="Subject" fillType="fill" />
               </div>

               <div className="letter-container">
                  {letters}
               </div>
            </ScrollArea>
         </div>
      </WindowsProgram>

      {letterElem}
   </>;
}

export default Mail;