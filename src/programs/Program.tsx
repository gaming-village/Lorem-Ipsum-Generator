import { useState } from "react";
import Game from "../Game";
import { getElem } from "../utils";

interface ProgramElemProps {
   name: string;
   program: Program;
   children: JSX.Element;
}
const ProgramElem = ({ name, program, children }: ProgramElemProps): JSX.Element => {
   const [opened, setOpened] = useState<boolean>(false);

   program.setVisibility = (newVal: boolean): void => {
      setOpened(newVal);
   }

   const minimizeFunc = () => program.close();
   
   return opened ? (
      <Program title={name} hasMinimizeButton={true} isDraggable={true} minimizeFunc={minimizeFunc}>
         {children}
      </Program>
   ) : <></>;
}

abstract class Program {
   private readonly name: string;

   setVisibility!: (newVal: boolean) => void;
   constructor(name: string, id: string) {
      this.name = name;

      const elemContent = this.instantiate();
      this.createElem(elemContent);

      Game.programs[id] = this;
   }

   private createElem(elemContent: JSX.Element): void {
      const elem = <ProgramElem name={this.name} program={this}>
         {elemContent}
      </ProgramElem>;

      const container = document.createElement("div");
      ReactDOM.render(elem, container);
      const computer = getElem("computer") as HTMLElement;
      computer.appendChild(container);
   }

   abstract instantiate(): JSX.Element;

   private open(): void {

   }

   private close(): void {

   }
}

export default Program;