import { useEffect, useRef, useState } from 'react';

import LOREM_PACKS, { SentenceStructure, StructurePart, Word } from '../data/lorem-pack-data';
import Game from '../Game';
import { createRandomPopup } from '../popups/Popup';
import { createTooltip, removeTooltip } from '../tooltips';
import { randInt, randItem } from '../utils';

const wordEndingChars = [" ", "."];

export let type: () => void;

const findWord = (sentence: string, endIdx: number): Word => {
   let idx = endIdx;
   let wordStr = "";
   while (true) {
      const newChar = sentence[idx];
      if (wordEndingChars.includes(newChar) || idx < 0) {
         break;
      }

      wordStr = newChar + wordStr;
      idx--;
   }
   
   let word!: Word;
   for (const loremPack of LOREM_PACKS) {
      if (Game.wordsTyped >= loremPack.requirements.wordsTyped && typeof loremPack.contents.words !== "undefined") {
         for (const currentWord of loremPack.contents.words) {
            for (const currentCase of currentWord.caseTable) {
               if (currentCase.includes(wordStr.toLowerCase())) {
                  word = currentWord;
               }
            }
         }
      }
   }
   return word;
}

const getLatinMeaning = (structurePart: StructurePart): string => {
   const x = structurePart.number === "singular" ? 0 : 1;
   const y = ["nominative", "accusative", "genetive", "dative", "ablative"].indexOf(structurePart.case!);

   let word!: Word;
   for (const loremPack of LOREM_PACKS) {
      if (typeof loremPack.contents.words === "undefined") continue;
      for (const currentWord of loremPack.contents.words) {
         if (currentWord.latin === structurePart.latin) {
            word = currentWord;
            break;
         }
      }
   }

   const english = word.caseTable[y][x];
   return english;
}

interface Dict {
   [key: number]: string;
}
const sentenceStructureToEnglish = (sentenceStructure: SentenceStructure): [string, string] => {
   const latinDict: Dict = {};
   const translationDict: Dict = {};

   const addToDict = (id: number, structurePart: StructurePart): void => {
      const englishTranslation = getLatinMeaning(structurePart);
      latinDict[id] = englishTranslation;
   }

   // Look for any nouns in the sentence
   
   const structureParts: Array<[number, StructurePart]> = Object.entries(sentenceStructure.structure).map(([a, b]) => [Number(a), b]);
   for (const [id, structurePart] of structureParts) {
      // Find the word definition
      let word!: Word;
      for (const loremPack of LOREM_PACKS) {
         if (Game.wordsTyped >= loremPack.requirements.wordsTyped && typeof loremPack.contents.words !== "undefined") {
            let hasFound = false;
            for (const currentWord of loremPack.contents.words) {
               if (currentWord.latin === structurePart.latin) {
                  word = currentWord;
                  hasFound = true;
                  break;
               }
            }
            if (hasFound) break;
         }
      }
      // Add it to the translation dictionary
      translationDict[id] = word.meaning;

      // If the word has already been parsed, don't bother
      if (typeof latinDict[id] !== "undefined") continue;

      if (structurePart.wordCategory === "noun") {
         addToDict(id, structurePart);

         // See if the noun has a matching word
         for (const pair of sentenceStructure.pairs) {
            const idx = pair.indexOf(id);
            if (idx !== -1) {
               const pairID = pair[Math.abs(idx - 1)];
               const pairWord = sentenceStructure.structure[pairID];
               const pairStructurePart: StructurePart = {
                  latin: pairWord.latin,
                  wordCategory: pairWord.wordCategory,
                  case: structurePart.case,
                  number: structurePart.number
               };
               addToDict(pairID, pairStructurePart);
            }
         }
      }
   }

   let sentence = "";
   for (const id of Object.keys(sentenceStructure.structure)) {
      sentence += latinDict[Number(id)];
      sentence += " ";
   }
   // Remove trailing whitespace
   sentence = sentence.substring(0, sentence.length - 1);

   // Combine the translation dict into a sentence
   // e.g. { 1: "lorem", 2: "ipsum"} becomes "lorem ipsum"
   // let sentence = "";
   let meaning = "";
   for (const id of sentenceStructure.meaning) {
      if (typeof id === "number") {
         // Number, add corresponding word from the translation dictionary to the sentence
         meaning += translationDict[id];
      } else {
         // String, add an extra word
         meaning += id;
      }
      meaning += " ";
   }
   // Remove trailing whitespace
   meaning = meaning.substring(0, meaning.length - 1);

   return [sentence, meaning];
}

// Converts a sentence into proper sentence format (punctionation and capitalisation)
// e.g. "lorem ipsum" becomes "Lorem ipsum."
const createSentence = (rawSentence: string): string => {
   // Capitalise first letter
   let sentence = rawSentence[0].toUpperCase() + rawSentence.substring(1, rawSentence.length);
   // Add punctuation
   sentence = sentence + ".";
   return sentence;
}

const getAvailableSentenceStructures = (): Array<SentenceStructure> => {
   let availableSentenceStructures = new Array<SentenceStructure>();
   for (const loremPack of LOREM_PACKS) {
      if (Game.wordsTyped >= loremPack.requirements.wordsTyped) {
         if (typeof loremPack.contents.sentenceStructures !== "undefined") {
            availableSentenceStructures = availableSentenceStructures.concat(loremPack.contents.sentenceStructures);
         }
      }
   }
   return availableSentenceStructures;
}

/** Gets the latin and translation of a random sentence */
const getRandomSentence = (): [string, string] => {
   const sentenceStructure = randItem(getAvailableSentenceStructures());
   const [rawSentence, sentenceMeaning] = sentenceStructureToEnglish(sentenceStructure);

   const sentence = createSentence(rawSentence);
   const meaning = createSentence(sentenceMeaning);

   return [sentence, meaning];
}

interface LoremSentenceProps {
   sentence: string;
   meaning: string;
   type: "regular" | "upcoming";
}
const LoremSentence = ({ sentence, meaning, type }: LoremSentenceProps) => {
   const ref = useRef<HTMLElement>(null);
   let tooltip: HTMLElement | null = null;

   const hoverTooltip = (): HTMLElement => {
      const buttonBounds = ref.current!.getBoundingClientRect();
      const pos = {
         left: buttonBounds.left + buttonBounds.width * 0.75 + "px",
         top: buttonBounds.top + buttonBounds.height / 2 + "px"
      }

      tooltip = createTooltip(pos, <span><b>Meaning:</b> {meaning}</span>);
      return tooltip;
   }

   const closeTooltip = () => {
      if (tooltip !== null) {
         removeTooltip(tooltip);
         tooltip = null;
      }
   }

   useEffect(() => {
      return () => {
         if (tooltip !== null) tooltip.remove();
      }
   })

   let className = "";
   if (type === "upcoming") {
      className = "upcoming";
   }

   return (
      <span className={className} onMouseOver={hoverTooltip} onMouseOut={closeTooltip} ref={ref}>{sentence}</span>
   );
}

let typesTilNextPopup = 100;

let currentSentence: string | null = null;
let currentSentenceMeaning: string | null = null;

// The preview of the next sentence to be typed (shown as gray text)
let upcomingSentence: string | null = null;
let upcomingSentenceMeaning: string | null = null;

let currentIndex = 0;
let bufferedContent: Array<JSX.Element> | null = null;
const LoremProductionSystem = () => {
   const [content, setContent] = useState<Array<JSX.Element> | null>(null);

   useEffect(() => {
      type = (): void => {
         if (typesTilNextPopup-- <= 0) {
            const POPUP_CHANCE = 0.1;
            if (Math.random() < POPUP_CHANCE) {
               createRandomPopup();

               typesTilNextPopup = randInt(20, 100);
            }
         }

         if (currentSentence === null) {
            if (upcomingSentence === null) {
               const [sentence, meaning] = getRandomSentence();
               upcomingSentence = sentence;
               upcomingSentenceMeaning = meaning;
            }

            currentSentence = upcomingSentence;
            currentSentenceMeaning = upcomingSentenceMeaning;
            
            {
               const [sentence, meaning] = getRandomSentence();
               upcomingSentence = sentence;
               upcomingSentenceMeaning = meaning;
            }

            if (content === null) {
               bufferedContent = new Array<JSX.Element>();
            } else {
               bufferedContent?.push(<span key={bufferedContent.length + 1}> </span>);
            }
            setContent(bufferedContent);
         }

         // Add the next letter to the content.
         // e.g. "Lorem ipsu" becomes "Lorem ipsum"

         if (currentIndex === 0) {
            bufferedContent?.push(
               <LoremSentence key={bufferedContent.length} sentence="a" meaning="b" type="regular" />
            );
         }

         const sentencePart = currentSentence.substring(0, currentIndex);
         bufferedContent![bufferedContent!.length - 1] = (
            <LoremSentence key={bufferedContent!.length} sentence={sentencePart} meaning={currentSentenceMeaning || "none"} type="regular" />
         );
         setContent(bufferedContent!.slice());

         // If a word has been completed, award lorem based on its value.
         if (wordEndingChars.includes(currentSentence[currentIndex + 1])) {
            const word = findWord(currentSentence, currentIndex);

            Game.lorem += word.value;
         }

         if (currentIndex >= currentSentence.length) {
            currentSentence = null;
            currentIndex = 0;
         } else {  
            currentIndex++;
         }
      }
   });

   let shownContent: Array<JSX.Element>;
   if (bufferedContent !== null && currentSentence !== null) {
      shownContent = bufferedContent.slice();

      // Create a preview of the remaining characters in the current sentence
      const remainingSentence = currentSentence.substring(currentIndex, currentSentence.length);
      if (remainingSentence.length > 0) {
         shownContent.push(
            <LoremSentence key={shownContent.length + 1} sentence={remainingSentence} meaning={currentSentenceMeaning!} type="upcoming" />
         );
      }

      shownContent.push(
         <LoremSentence key={shownContent.length + 1} sentence={" " + upcomingSentence!} meaning={upcomingSentenceMeaning!} type="upcoming" />
      );
   }


   return <div id="lorem-container">
      {bufferedContent !== null ? shownContent! : <span className="instruction">Type to generate lorem</span>}
   </div>;
}

export default LoremProductionSystem;