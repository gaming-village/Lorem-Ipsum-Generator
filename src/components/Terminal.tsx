import { useEffect, useRef, useState } from "react";
import Game from "../Game";

interface TerminalParameter {
   [key: string]: TerminalParameter | null | undefined;
   _anyStr?: null;
   _anyNum?: null;
}

interface TerminalCommand {
   name: string;
   /** The function called when the command is entered */
   onEnter?: (writeLine: (rawMessage: string) => void, parameters?: Array<string>) => void;
   /** The number of words typed before the command becomes unlocked. Should only be present on commands which aren't dev commands or hidden */
   typedWordsRequirement?: number;
   parameters?: TerminalParameter;
   isDevCommand?: boolean;
   isHidden?: boolean;
}
const TERMINAL_COMMANDS: ReadonlyArray<TerminalCommand> = [
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
      name: "exit",
      typedWordsRequirement: 0
   },
   {
      name: "clear",
      typedWordsRequirement: 10
   },
   {
      name: "lorem",
      isDevCommand: true
   },
   {
      name: "packets",
      isDevCommand: true
   },
   {
      name: "popups",
      parameters: {
         summon: {
            all: null,
            _anyStr: null
         },
         kill: {
            all: null,
            _anyStr: null
         },
         unlock: {
            all: null,
            _anyStr: null
         }
      },
      isDevCommand: true
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

const getCommand = (rawCommand: string): TerminalCommand | string => {
   const baseCommand = rawCommand.split(" ")[0];
   for (const command of TERMINAL_COMMANDS) {
      if (command.name === baseCommand) {
         return command;
      }
   }
   return `Error: '${baseCommand}' is not a command!`;
}

const getParameters = (command: TerminalCommand, rawCommand: string): Array<string> | null => {
   const parameters = rawCommand.split(" ");
   parameters.splice(0, 1);
   console.log(command);

   for (const parameter of Object.entries(command.parameters!)) {
      console.log(parameter);
   }

   return parameters;
}

enum FORMAT_COLOURS {
   r = "RED",
   y = "YELLOW",
   g = "#03fc28",
   a = "#000",
   d = "#bbb",
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

      if (previousChar === "%") {
         spans.push(
            <span style={getCurrentStyle()} key={spans.length}>{currentSpan}</span>
         );
         
         // If the modifier is for colour
         const colour = FORMAT_COLOURS[char as keyof typeof FORMAT_COLOURS];
         if (typeof colour !== "undefined") {
            currentStyle.colour = colour;
         }

         const decoration = FORMAT_DECORATION[("_" + char) as keyof typeof FORMAT_DECORATION];
         if (typeof decoration !== "undefined") {
            switch (decoration) {
               case "bold": {
                  currentStyle.isBold = true;
                  break;
               }
               case "italic": {
                  currentStyle.isItalic = true;
                  break;
               }
            }
         }

         currentSpan = "";
      } else if (char !== "%") {
         currentSpan += char;
      }
   }
   spans.push(
      <span style={getCurrentStyle()} key={spans.length}>{currentSpan}</span>
   );

   return <div className="command" key={key}>
      {spans}
   </div>;
}

let messageHistoryBuffer = new Array<string>();
const Terminal = () => {
   const [messageHistory, setMessageHistory] = useState<Array<string>>(new Array<string>());
   const inputRef = useRef<HTMLInputElement>(null);

   const writeLine = (rawMessage: string): void => {
      messageHistoryBuffer.push(rawMessage);
      setMessageHistory(messageHistoryBuffer.slice());
   }

   useEffect(() => {
      Game.isInFocus = true;
      Game.blurScreen();
      Game.showMask();

      // Force focus the element
      inputRef.current!.focus();

      return () => {
         Game.isInFocus = false;
         Game.unblurScreen();
         Game.hideMask();
      }
   }, []);

   const enterKey = (): void => {
      const event = window.event as KeyboardEvent;
      if (event.key !== "Enter") return;

      const rawCommand = inputRef.current!.value;
      const command = getCommand(rawCommand);

      if (typeof command === "string") {
         messageHistoryBuffer.push(command);
      } else {

         // If the user sent a valid command
         if (typeof command.onEnter !== "undefined") {
            // If the command has parameters
            if (typeof command.parameters !== "undefined") {
               const parameters = getParameters(command, rawCommand);
               // If the parameters are valid
               if (parameters !== null) {
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

   return <div id="terminal">
      <div className="title">
         <span>Terminal</span>
      </div>

      {messageHistory.map((rawCommand, i) => {
         return formatMessage(rawCommand, i);
      })}

      <input onKeyDown={enterKey} ref={inputRef} type="text" />
   </div>;
}

export let openTerminal: () => void;

const TerminalContainer = () => {
   const [isOpen, setIsOpen] = useState(true);

   useEffect(() => {
      openTerminal = (): void => {
         setIsOpen(true);
      }
   }, []);

   return isOpen ? <Terminal /> : <></>;
}

export default TerminalContainer;