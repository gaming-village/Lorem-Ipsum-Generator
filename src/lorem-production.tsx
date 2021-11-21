import React from "react";
import Button from "./components/Button";
import List from "./components/List";
import { loremCorp } from "./corporate-overview";
import LOREM_PACKS, { LoremCategory, LoremPack, LoremWord, SentenceStructure } from "./data/lorem-packs-data";
import Game from "./Game";
import { createTooltip, removeTooltip } from "./tooltips";
import { hasUpgrade } from "./upgrades";
import { beautify, capitalise, getElem, randInt, randItem } from "./utils";

const getAvailablePacks = (): ReadonlyArray<LoremPack> => {
   return LOREM_PACKS.filter(pack => pack.isBought);
}

const getWordFromCategory = (category: LoremCategory): string => {
   // Get all bought lorem packs
   const availablePacks = getAvailablePacks();

   // Find all words which are available and have the required category
   const availableWords = availablePacks.reduce((previousValue, currentValue) => {
      const wordsInCategory = currentValue.loremWords.filter(word => word.category === category);
      return previousValue.concat(wordsInCategory as Array<never>);
   }, []);

   // Choose a random word
   const randomWord: LoremWord = randItem(availableWords);
   return randomWord.latin;
}

const getRandomSentence = (): string => {
   // Get bought sentence structures
   const availablePacks = getAvailablePacks();

   // Create an array of all possible sentence structures
   const availableSentenceStructures: ReadonlyArray<SentenceStructure> = availablePacks.reduce((previousValue, currentValue) => {
      if (currentValue.sentenceStructures) return previousValue.concat(currentValue.sentenceStructures as Array<never>);
      return previousValue;
   }, []);

   // Choose a random sentence structure
   const sentenceStructure = randItem(availableSentenceStructures);

   // Fill the sentence structure
   const sentence: string = sentenceStructure.reduce((previousValue: string, currentValue: string, i: number) => {
      let newWord: string;
      if (Array.isArray(currentValue)) {
         newWord = getWordFromCategory(currentValue[0]);
      } else {
         newWord = currentValue;
      }
      if (i === 0) newWord = capitalise(newWord);
      return `${previousValue} ${newWord}`;
   }, "");

   return sentence.substr(1, sentence.length) + ". ";
}

const findWord = (sentence: string, wordEndIndex: number): LoremWord => {
   // Find out which word it is
   let wordString: string = "";
   let i: number = wordEndIndex;
   while (true) {
      if (i < 0) break;

      const letter = sentence.split("")[i].toLowerCase();
      if (letter !== " " && letter !== ".") {
         wordString = letter + wordString;
      } else {
         break;
      }
      i--;
   }

   // Get its corresponding LoremWord
   for (const loremPack of LOREM_PACKS) {
      for (const word of loremPack.loremWords) {
         if (word.latin === wordString) {
            return word;
         }
      }
   }
   throw new Error(`Could not find a reference to lorem word '${wordString}'`);
}

let currentSentence: string = getRandomSentence();
let letterIndex = 0;
let hasTyped: boolean = false;
export function type(key: string): void {
   // console.log(key);
   const loremContainer = getElem("lorem-container");

   if (!hasTyped) {
      loremContainer.innerHTML = "";
   }
   hasTyped = true;

   if (letterIndex >= currentSentence.length) {
      currentSentence = getRandomSentence();
      letterIndex = 0;
   }

   const currentCharacter = currentSentence.split("")[letterIndex];
   loremContainer.innerHTML += currentCharacter;

   const nextCharacter = currentSentence.split("")[letterIndex + 1];
   const NON_LETTER_CHARACTERS: ReadonlyArray<string> = [" ", "."];
   if (!NON_LETTER_CHARACTERS.includes(currentCharacter) && NON_LETTER_CHARACTERS.includes(nextCharacter)) {
      const currentWord = findWord(currentSentence, letterIndex);
      
      let loremValue: number = currentWord.value;
      if (hasUpgrade("Typewriter")) loremValue *= 2;
      Game.lorem += loremValue;

      Game.wordsTyped++;
   }

   if (hasUpgrade("Mechanical Keyboard") && Math.random() < 0.1) {
      const randomWorkerIndex = randInt(0, loremCorp.jobIndex + 1);
      loremCorp.workers[randomWorkerIndex]++;
   }

   letterIndex++;
}

const getPack = (packNum: number): HTMLElement => {
   return getElem("corporate-overview").querySelector(`.lorem-packs-shop-panel .lorem-pack-${packNum}`) as HTMLElement;
}

const buyPack = (packInfo: LoremPack, pack: HTMLElement) => {
   if (Game.wordsTyped < packInfo.requirements.wordsTyped) return;

   packInfo.isBought = true;
   loremCorp.updateCorporateOverview();
}

const showPackPreview = (packInfo: LoremPack, pack: HTMLElement) => {
   const previewOpener = pack.querySelector(".pack-preview-opener") as HTMLElement;
   const openerBounds = previewOpener.getBoundingClientRect();

   const wordTables: Array<JSX.Element> = packInfo.loremWords.map((word, i) => {
      return (
         <tr key={i}>
            <td>{word.latin}</td>
            <td>{word.meaning}</td>
            <td>{word.value}</td>
         </tr>
      )
   });

   let sentenceStructureList: Array<JSX.Element> = [];
   if (packInfo.sentenceStructures) sentenceStructureList = packInfo.sentenceStructures.map((sentenceStructure, i) => {
      const template = sentenceStructure.reduce((previousValue, currentValue) => {
         if (Array.isArray(currentValue)) return `${previousValue} [${currentValue.join("/")}]`;
         return `${previousValue} ${currentValue}`;
      }, "");
      return (
         <li key={i}>{template}</li>
      )
   });

   const packPreview = <>
      <h2>{packInfo.name} Contents</h2>

      <p className="caption">Words:</p>
      <table>
         <tbody>
            <tr>
               <th>Word</th>
               <th>Meaning</th>
               <th>Lorem Value</th>
            </tr>
            {wordTables}
         </tbody>
      </table>

      {sentenceStructureList.length > 0 ? <p className="caption">Sentence structures:</p> : ""}
      {sentenceStructureList}
   </>;

   const tooltipPosition = {
      top: `${openerBounds.top + openerBounds.height/2}px`,
      left: `${openerBounds.left + openerBounds.width/2}px`
   };
   const tooltip = createTooltip(tooltipPosition, packPreview);
   tooltip.classList.add("lorem-tooltip");

   const mouseLeaveEvent = () => {
      removeTooltip(tooltip);
      previewOpener.removeEventListener("mouseleave", mouseLeaveEvent);
   }
   previewOpener.addEventListener("mouseleave", mouseLeaveEvent);
}

export function getPackElements(): ReadonlyArray<JSX.Element> {
   let packElements: Array<JSX.Element> = [];

   for (let i = 0; i < LOREM_PACKS.length; i++) {
      const packInfo: LoremPack = LOREM_PACKS[i];

      const wordCategoryDictionary: { [key: string]: number } = {};
      for (const word of packInfo.loremWords) {
         if (!wordCategoryDictionary.hasOwnProperty(word.category)) {
            wordCategoryDictionary[word.category] = 1;
         } else {
            wordCategoryDictionary[word.category]++;
         }
      }

      const packContents: Array<JSX.Element> = [];
      for (let k = 0; k < Object.entries(wordCategoryDictionary).length; k++) {
         const category = Object.entries(wordCategoryDictionary)[k];
         packContents.push(
            <li key={k}>{`${category[1]} ${beautify(...category)}`}</li>
         )
      }
      if (packInfo.sentenceStructures) packContents.push(
         <li key={packContents.length}>{`${packInfo.sentenceStructures.length} ${beautify("Sentence Structure", packInfo.sentenceStructures.length)}`}</li>
      )

      const packImgSrc = require(`./images/lorem-packs/${packInfo.packImgSrc}`).default;
      const expandIconSrc = require("./images/icons/earth.png").default;

      const pack = <div key={i} className={`lorem-pack lorem-pack-${i} ${packInfo.isBought ? "bought" : ""}`}>
         <div className="top-section">
            <img src={packImgSrc} alt="" />
            <h2>{packInfo.name}</h2>
         </div>

         {!packInfo.isBought ? <p className="text-box">Requires {packInfo.requirements.wordsTyped} words typed.</p> : ""}

         <p>{packInfo.description}</p>

         <p className="list-caption">Includes:</p>
         <List>
            <>
               {packContents}
            </>
         </List>

         <div onMouseEnter={() => showPackPreview(packInfo, getPack(i))} className="pack-preview-opener">
            <p className="caption">Hover to see full contents.</p>
            <img className="open-icon" src={expandIconSrc} alt="" />
         </div>

         {!packInfo.isBought ?
         <Button onClick={() => buyPack(packInfo, getPack(i))} text="Unlock" isCentered={true} />
         : ""}
         
      </div>;
      packElements.push(pack);

      if (i + 1 < LOREM_PACKS.length) {
         packElements.push(
            <div key={i + LOREM_PACKS.length} className="seperator"></div>
         );
      }
   }

   return packElements;
}