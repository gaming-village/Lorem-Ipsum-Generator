import { useCallback, useState } from "react";

import Button from "../Button";
import ScrollArea from "../ScrollArea";
import WindowsProgram from "../WindowsProgram";
import Section from "../Section";

import WhiteLetter from "../../images/icons/white-letter.png";
import RootFolder from "../../images/icons/folder-container.png";
import LetterImg from "../../images/icons/letter.png";

import LETTER_DATA, { LetterInfo } from "../../data/letter-data";
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
   for (const currentLetter of LETTER_DATA) {
      if (currentLetter.subject === letterSubject) {
         letter = currentLetter;
         break;
      }
   }

   if (!letter.isReceived) {
      letter.isReceived = true;

      const clickEvent = (): void => {
         forceOpenLetter!(letter);
      }

      createNotification({
         iconSrc: "folder.png",
         title: letter.subject,
         description: <>You've got mail!</>,
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
   for (const letter of LETTER_DATA) {
      if (letter.isReceived && letter.folder === folder.name) {
         folderLetters.push(letter);
      }
   }
   return folderLetters;
}

/** If a folder has a letter which is unopened */
const folderHasUnopened = (folder: FolderInfo): boolean => {
   for (const letter of LETTER_DATA) {
      if (letter.folder === folder.name && letter.isReceived && !letter.isOpened) {
         return true;
      }
   }
   return false;
}

interface LetterProps {
   letter: LetterInfo | null;
   closeFunc: () => void;
   isClaimed: boolean;
   claimFunc?: () => void;
}
const Letter = ({ letter, closeFunc, isClaimed,claimFunc }: LetterProps) => {
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

         <div id="reward-container" className={`text-box${isClaimed ? " claimed" : ""}`}>
            {typeof letter.reward !== "undefined" ? <>
               <h3>Rewards</h3>

               <ul>
                  {letter.reward.items.map((item, i) => {
                     return <li key={i}>{item}</li>;
                  })}
               </ul>

               <Button onClick={() => claimFunc!()} isCentered isDark={isClaimed} isFlashing={!isClaimed}>{!isClaimed ? "Claim All" : "Claimed!"}</Button>
            </> : (
               <p className="no-rewards-notice">This letter has no rewards!</p>
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
   const [letterIsClaimed, setLetterIsClaimed] = useState<boolean | null>(null);

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
      setLetterIsClaimed(typeof newLetter.reward !== "undefined" && newLetter.reward.isClaimed);
   }

   /** Claim the current letter's reward */
   const claimLetterReward = useCallback(() => {
      const reward = currentLetter!.reward!;

      reward.isClaimed = true;
      reward.claimFunc();
      setLetterIsClaimed(true);
   }, [currentLetter]);

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

   const letterElem = <Letter letter={currentLetter} closeFunc={closeLetter} isClaimed={letterIsClaimed !== null ? letterIsClaimed : false} claimFunc={currentLetter !== null && currentLetter!.reward ? claimLetterReward : undefined} />
   
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