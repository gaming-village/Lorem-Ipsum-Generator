import React, { useEffect, useState } from 'react';
import LOREM_PACKS, { SentenceStructure, StructurePart, Word, NounCases } from '../data/lorem-packs-data';
import Game from '../Game';
import { randItem } from '../utils';

export let type: () => void;

const translateLatinToEnglish = (structurePart: StructurePart): string => {
   let english!: string;
   // switch (structurePart.wordCategory) {
   //    case "noun": {
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

   console.log(structurePart);
   console.log(word.caseTable, x, y);
   english = word.caseTable[y][x];
   //    }
   // }
   return english;
}

interface TranslationDict {
   [key: number]: string;
}
const sentenceStructureToEnglish = (sentenceStructure: SentenceStructure): string => {
   const translationDict: TranslationDict = {};

   const addToDict = (id: number, structurePart: StructurePart): void => {
      const englishTranslation = translateLatinToEnglish(structurePart);
      translationDict[id] = englishTranslation;
   }

   // Look for any nouns in the sentence
   
   const structureParts: Array<[number, StructurePart]> = Object.entries(sentenceStructure.structure).map(([a, b]) => [Number(a), b]);
   for (const [id, structurePart] of structureParts) {
      if (structurePart.wordCategory === "noun") {
         console.log(id);
         addToDict(id, structurePart);

         // See if the noun has a matching word
         for (const pair of sentenceStructure.pairs) {
            const idx = pair.indexOf(id);
            console.log(typeof id);
            console.log(pair, id);
            if (idx !== -1) {
               // console.log("Found pair!", pairWord, idx, pairID);
               const pairID = pair[Math.abs(idx - 1)];
               const pairWord = sentenceStructure.structure[pairID];
               const pairStructurePart: StructurePart = {
                  latin: pairWord.latin,
                  wordCategory: pairWord.wordCategory,
                  case: structurePart.case
               };
               addToDict(pairID, pairStructurePart);
            }
         }
      }
   }

   console.log(translationDict);
   return "obama gaming";
}

const getAvailableSentenceStructures = (): Array<SentenceStructure> => {
   let availableSentenceStructures = new Array<SentenceStructure>();
   for (const loremPack of LOREM_PACKS) {
      if (Game.wordsTyped > loremPack.requirements.wordsTyped) {
         if (typeof loremPack.contents.sentenceStructures !== "undefined") {
            availableSentenceStructures = availableSentenceStructures.concat(loremPack.contents.sentenceStructures);
         }
      }
   }
   return availableSentenceStructures;
}

let currentSentence: string | null = null;
const LoremProductionSystem = () => {
   const [content, setContent] = useState("");

   useEffect(() => {
      type = (): void => {
         if (currentSentence === null) {
            const sentenceStructure = randItem(getAvailableSentenceStructures());
            const sentence = sentenceStructureToEnglish(sentenceStructure);
            currentSentence = sentence;
         }
      }
   });

   return <div id="lorem-container">
      <span className="instruction">(Type to generate lorem)</span>
   </div>;
}

export default LoremProductionSystem;