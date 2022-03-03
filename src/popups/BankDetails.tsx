import { useRef, useState } from "react";
import Button from "../components/Button";

import WarningIcon from "../images/icons/warning.png";

import { isPrime, randInt, randItem } from "../utils";
import Game from "../Game";
import Popup from "./Popup";

const validateInput = (userInput: string, inputType: number): string | true => {
   const len = userInput.length;

   // Get the number of special characters
   const SPECIAL_CHARACTERS = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
   let specialCharacters = new Array<string>();
   for (const char of userInput.split("")) {
      if (SPECIAL_CHARACTERS.includes(char)) specialCharacters.push(char);
   }

   const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
   const VOWELS = ["a", "e", "i", "o", "u"];

   switch (inputType) {
      case 0: {
         if (len !== 10) {
            return "The input must be 10 characters long.";
         }
         if (!isPrime(specialCharacters.length)) {
            return "The input must contain a prime number of special characters.";
         }

         let numExclamationMarks = 0;
         for (const char of specialCharacters) {
            if (char === "!") numExclamationMarks++;
         }
         if (numExclamationMarks < 2) {
            return "The input must have at least 2 exclamation marks!!";
         }
         if (userInput[0] !== "(" || userInput[len - 1] !== ")") {
            return "The input must start and end with parenthesis!"
         }
         break;
      }
      case 1: {
         const seenChars = new Array<string>();
         let vowelCount = 0;
         let previousCharIsVowel = false;
         for (const char of userInput) {
            if (seenChars.includes(char)) {
               return "No two characters can be the same!";
            }
            seenChars.push(char);

            if (VOWELS.includes(char)) {
               if (previousCharIsVowel) {
                  return "Vowels cannot be next to each other!"
               }

               vowelCount++;
               previousCharIsVowel = true;
            } else {
               previousCharIsVowel = false;
            }

            if (!LETTERS.includes(char)) {
               return "Every character must be a letter!";
            }
         }

         if (vowelCount < 2) {
            return "The input must contain at least two vowels!";
         }

         if (vowelCount === len) {
            return "The input must contain a consonant!";
         }
         break;
      }
      case 2: {
         break;
      }
      case 3: {
         break;
      }
   }
   return true;
}

interface ElemProps {
   popup: BankDetails;
}
const Elem = ({ popup }: ElemProps) => {
   const [userInput, setUserInput] = useState<string>("");
   const inputType = useRef(randInt(0, 2));
   const inputRef = useRef<HTMLInputElement>(null);

   const updateInput = () => {
      const inputVal = inputRef.current!.value;
      setUserInput(inputVal);
   }

   const inputIsValid: string | true = validateInput(userInput, inputType.current);

   const BAD_ADJECTIVES = ["TERRIBLE", "HIDEOUS", "SICKENING", "AGONISING", "DREADFUL", "RANCID", "PATHETIC", "REPULSIVE", "HOPELESS", "ATROCIOUS", "ABHORRENT", "APPALLING", "AWFUL", "INSUFFERABLE", "ALARMING", "LAUGHABLE", "ABYSMAL", "ABOMINABLE", "REPUGNANT"];
   const randomAdjective = randItem(BAD_ADJECTIVES);

   return <>
      <div className="warning-container">
         <img src={WarningIcon} alt="Warning!" />
         <p>In order to security your purchase, we reqiure the Details</p>
      </div>

      <p style={{textDecoration: "underline"}}>&gt; Pls give me bank acount details below!</p>

      <p>Current password strength: {typeof inputIsValid === "string" ? (
         <span style={{color: "#880000", fontWeight: 600}}>{randomAdjective}</span>
      ) : ""}</p>

      <input style={{marginLeft: "50%", transform: "translateX(-50%)"}} ref={inputRef} type="text" onChange={updateInput} />

      {typeof inputIsValid === "string" ? (
         <p style={{color: "red"}}>ERROR: {inputIsValid}</p>
      ) : undefined}

      <Button onClick={inputIsValid === true ? () => popup.close() : undefined} isDark={typeof inputIsValid === "string"} isCentered>Submit</Button>
   </>;
}

class BankDetails extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }

   close(): void {
      super.close();

      Game.lorem += 10;
   }
}

export default BankDetails