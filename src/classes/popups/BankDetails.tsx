import { useRef, useState } from "react";
import Button from "../../components/Button";

import { isPrime, randInt, randItem } from "../../utils";
import Game from "../../Game";
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
         // Example of valid input:
         // (!!!aaaaa)

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
         // Example of valid input:
         // ake

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
         // Example of valid input:
         // Pass123abc@

         if (!userInput.toLowerCase().includes("pass")) {
            return "Input must contain 'pass'!";
         }

         if (!userInput.includes("123")) {
            return "Input must contain '123'!";
         }

         if (!userInput.includes("abc")) {
            return "Input must contain 'abc'!";
         }

         if (userInput === userInput.toLowerCase()) {
            return "Input must contain at least one capital letter!";
         }

         if (specialCharacters.length === 0) {
            return "Input must contain at least one special character!";
         }

         if (len < 8) {
            return "Input must be at least 8 characters long!";
         }

         break;
      }
      case 3: {
         const num = Number(userInput);
         if (isNaN(num)) {
            return "Input must be a number!";
         }

         if (!Number.isInteger(Math.sqrt(num))) {
            return "Input must be a square number!";
         }

         for (const char of userInput.split("").map(Number)) {
            if (!isPrime(char)) {
               return "All digits of the input must be prime!";
            }
         }

         break;
      }
   }
   return true;
}

interface ElemProps {
   popup: BankDetails;
}
const Elem = ({ popup }: ElemProps) => {
   const [inputVal, setInputVal] = useState<string>("");
   const [inputIsValid, setInputIsValid] = useState<string | true | null>(null);
   const inputType = useRef(randInt(0, 4));
   const inputRef = useRef<HTMLInputElement>(null);

   const updateInputVal = (): void => {
      const inputVal = inputRef.current!.value;
      setInputVal(inputVal);
   }

   const enterPress = (): void => {
      const event = window.event as KeyboardEvent;
      const key = event.key;
      if (key === "Enter") {
         submit();
      }
   }

   const submit = (): void => {
      const newInputIsValid = validateInput(inputVal, inputType.current);
      setInputIsValid(newInputIsValid);

      if (newInputIsValid === true) setTimeout(() => {
         popup.close();
      }, 1000);
   }

   const BAD_ADJECTIVES = ["TERRIBLE", "HIDEOUS", "SICKENING", "AGONISING", "DREADFUL", "RANCID", "PATHETIC", "REPULSIVE", "HOPELESS", "ATROCIOUS", "ABHORRENT", "APPALLING", "AWFUL", "INSUFFERABLE", "ALARMING", "LAUGHABLE", "ABYSMAL", "ABOMINABLE", "REPUGNANT"];
   const randomAdjective = randItem(BAD_ADJECTIVES);

   return <>
      <p style={{textDecoration: "underline"}}>&gt; Give me bank acount detales below!</p>

      <p>Current password strength: {typeof inputIsValid === "string" || inputIsValid === null ? (
         <span style={{color: "#880000", fontWeight: 600}}>{randomAdjective}</span>
      ) : (
         <span style={{color: "#008800"}}>OKAY</span>
      )}</p>

      <input onChange={updateInputVal} onKeyDown={enterPress} style={{marginLeft: "50%", transform: "translateX(-50%)"}} ref={inputRef} type="text" />

      {typeof inputIsValid === "string" ? (
         <p style={{color: "red"}}>ERROR: {inputIsValid}</p>
      ) : inputIsValid === true ? (
         <p style={{color: "lime", textAlign: "center", textShadow: "0 0 3px #000, 0 0 2px #000, 0 0 1px #000"}}>Accepted.</p>
      ) : undefined}

      <Button isDark={inputIsValid === true} onClick={submit} isCentered>Submit</Button>
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