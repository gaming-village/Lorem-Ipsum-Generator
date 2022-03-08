import { useEffect, useRef, useState } from "react";

import Application from "./Application";

interface Parameter {
   [key: string]: Parameter | null | undefined;
   _anyStr?: null;
   _anyNum?: null;
}

interface Command {
   name: string;
   /** The function called when the command is entered */
   onEnter?: (writeLine: (rawMessage: string) => void, parameters?: Array<string>) => void;
   /** The number of words typed before the command becomes unlocked. Should only be present on commands which aren't dev commands or hidden */
   typedWordsRequirement?: number;
   parameters?: Parameter;
   isDevCommand?: boolean;
   isHidden?: boolean;
}
const TERMINAL_COMMANDS: ReadonlyArray<Command> = [
   {
      name: "help",
      onEnter: (writeLine: (rawMessage: string) => void): void => {
         writeLine("%fAvailable commands:");

         // Get all unlocked commands
         for (const command of TERMINAL_COMMANDS) {
            if (!command.isDevCommand && !command.isHidden) {
               writeLine(`%d - ${command.name}`);
            }
         }
      },
      typedWordsRequirement: 0
   },
   {
      name: "clear",
      onEnter: (_1): void => {
         clearMessageHistory();
      },
      typedWordsRequirement: 10
   },
   {
      name: "exit",
      typedWordsRequirement: 0
   },
   {
      name: "test",
      onEnter: (writeLine: (rawMessage: string) => void, parameters?: Array<string>): void => {

      },
      parameters: {
         1: null,
         _anyNum: null
      },
      isDevCommand: true
   },
   {
      name: "mac",
      isHidden: true
   }
];

const getCommand = (rawCommand: string): Command | string => {
   const baseCommand = rawCommand.split(" ")[0];
   for (const command of TERMINAL_COMMANDS) {
      if (command.name === baseCommand && !(process.env.NODE_ENV !== "development" && command.isDevCommand)) {
         return command;
      }
   }
   return `%rError: %d%1'${baseCommand}' %c$1is not a command! Enter 'help' to see all available commands.`;
}

const getParameters = (command: Command, rawCommand: string): Array<string> | null => {
   const parameters = rawCommand.split(" ");
   parameters.splice(0, 1);
   console.log(command);

   for (const parameter of Object.entries(command.parameters!)) {
      console.log(parameter);
   }

   return parameters;
}

enum FORMAT_COLOURS {
   r = "#f53527",
   y = "YELLOW",
   g = "#03fc28",
   a = "#000",
   c = "#999",
   d = "#bbb",
   e = "#ddd",
   f = "#fff"
}
enum FORMAT_DECORATION {
   // The underscore is needed because enums don't accpet numeric names
   _0 = "bold",
   _1 = "italic"
}

// e.g. %r%0Among Us = red bold Among Us
const formatMessage = (rawMessage: string, key: number): JSX.Element => {
   const CHARS = rawMessage.split("");
   const spans = new Array<JSX.Element>();

   const currentStyle = {
      // Default colour is white
      colour: "#fff",
      isBold: false,
      isItalic: false
   }

   const getCurrentStyle = (): React.CSSProperties => {
      return {
         color: currentStyle.colour !== "" ? currentStyle.colour : undefined,
         fontWeight: currentStyle.isBold ? 600 : undefined,
         fontStyle: currentStyle.isItalic ? "italic" : undefined
      }
   }

   let currentSpan: string = "";
   for (let i = 0; i < CHARS.length; i++) {
      const char: string = CHARS[i];
      const previousChar: string | null = i > 0 ? CHARS[i - 1] : null;

      if (previousChar === "%" || previousChar === "$") {
         spans.push(
            <span style={getCurrentStyle()} key={spans.length}>{currentSpan}</span>
         );
         
         // If the modifier is for colour
         if (previousChar === "%") {
            const colour = FORMAT_COLOURS[char as keyof typeof FORMAT_COLOURS];
            if (typeof colour !== "undefined") {
               currentStyle.colour = colour;
            }
         }

         const decoration = FORMAT_DECORATION[("_" + char) as keyof typeof FORMAT_DECORATION];
         if (typeof decoration !== "undefined") {
            switch (decoration) {
               case "bold": {
                  if (previousChar === "%") {
                     currentStyle.isBold = true;
                  } else {
                     currentStyle.isBold = false;
                  }
                  break;
               }
               case "italic": {
                  if (previousChar === "%") {
                  currentStyle.isItalic = true;
                  } else {
                  currentStyle.isItalic = false;
                  }
                  break;
               }
            }
         }

         currentSpan = "";
      } else if (char !== "%" && char !== "$") {
         currentSpan += char;
      }
   }
   spans.push(
      <span style={getCurrentStyle()} key={spans.length}>{currentSpan}</span>
   );

   return <div className="message" key={key}>
      {spans}
   </div>;
}

let clearMessageHistory: () => void;

let messageHistoryBuffer = new Array<string>();
const Elem = () => {
   const [messageHistory, setMessageHistory] = useState<Array<string>>(messageHistoryBuffer.slice());
   const inputRef = useRef<HTMLInputElement>(null);

   clearMessageHistory = (): void => {
      messageHistoryBuffer = new Array<string>();
      setMessageHistory(messageHistoryBuffer.slice());
   }

   const writeLine = (rawMessage: string): void => {
      messageHistoryBuffer.push(rawMessage);
      setMessageHistory(messageHistoryBuffer.slice());
   }

   useEffect(() => {
      // Force focus the input
      inputRef.current!.focus();
   }, []);

   const inputKey = (): void => {
      const event = window.event as KeyboardEvent;
      if (event.key !== "Enter") return;

      const userInput = inputRef.current!.value;
      if (userInput === "") return;
      
      const command = getCommand(userInput);
      if (typeof command === "string") {
         writeLine("%e> " + userInput);

         messageHistoryBuffer.push(command);
      } else {
         writeLine("%g> " + userInput);
         
         // If the user sent a valid command
         if (typeof command.onEnter !== "undefined") {
            // If the command has parameters
            if (typeof command.parameters !== "undefined") {
               const parameters = getParameters(command, userInput);
               // If the parameters are valid
               if (parameters !== null) {
                  console.log(clearMessageHistory);
                  command.onEnter(writeLine, parameters);
               }
            } else {
               command.onEnter(writeLine);
            }
         }
      }

      setMessageHistory(messageHistoryBuffer.slice());

      inputRef.current!.value = "";
   }

   return <>
      <div id="command-box">
         <div className="messages">
            <div className="formatter">
               {messageHistory.map((rawCommand, i) => {
                  return formatMessage(rawCommand, i);
               })}
            </div>
         </div>

         <input onKeyDown={inputKey} ref={inputRef} placeholder="Enter a command." type="text" />
      </div>
   </>;
}

class CommandPrompt extends Application {
   protected instantiate(): JSX.Element {
      return <Elem />;
   }
}

export default CommandPrompt;