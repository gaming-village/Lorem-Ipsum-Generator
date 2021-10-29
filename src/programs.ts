import { dragElem, getElem } from "./utils";

export const programs: any = {};
const programNames: string[] = ["preferences"];

interface Program {
   elementID: string;
   setup: () => void;
}

export function initialisePrograms() {
   for (const name of programNames) {
      const program: Program = require("./programs/" + name).default;
      programs[name] = program;

      const element = getElem(program.elementID);
      element?.querySelector(".minimize")?.addEventListener("click", () => {
         closeProgram(name);
      });

      const titleBar: HTMLElement = (element.querySelector(".title-bar") as HTMLElement);
      dragElem(element, titleBar);
   }
}

export function setupPrograms() {
   for (let i = 0; i < Object.values(programs).length; i++) {
      const program: Program = (Object.values(programs)[i] as Program);
      if (program.hasOwnProperty("setup")) {
         program.setup();
      }
   }
}

export function programIsOpen(elementName: string): boolean {
   const element = getElem(elementName);
   if (element) return !element.classList.contains("hidden");
   return false;
}

export function openProgram(name: string) {
   const program = programs[name];

   getElem(program.elementID)?.classList.remove("hidden");
}

export function closeProgram(name: string) {
   const program = programs[name];

   getElem(program.elementID)?.classList.add("hidden");
}