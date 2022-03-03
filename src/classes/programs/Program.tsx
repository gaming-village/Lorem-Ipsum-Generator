import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { focusProgram } from "../../pages/Home";
import { createFile } from "../../components/FileSystem";
import WindowsProgram from "../../components/WindowsProgram";
import Game from "../../Game";
import { getElem } from "../../utils";

interface ProgramElemProps {
   name: string;
   id: string;
   program: Program;
   isChurchProgram: boolean;
   children: JSX.Element;
}
const ProgramElem = ({ name, id, program, isChurchProgram, children }: ProgramElemProps): JSX.Element => {
   const [opened, setOpened] = useState<boolean>(false);
   const programRef = useRef(null);

   useEffect(() => {
      if (programRef.current) focusProgram(programRef.current);
   });

   program.setVisibility = (newVal: boolean): void => {
      setOpened(newVal);
   }

   const minimizeFunc = () => program.close();
   
   return opened ? (
   <WindowsProgram className={isChurchProgram ? "church-of-lorem" : ""} ref={programRef} title={name} id={id} uiButtons={["minimize"]} isDraggable={true} minimizeFunc={minimizeFunc}>
         {children}
      </WindowsProgram>
   ) : <></>;
}

interface ProgramType {
   name: string;
   id: string;
   fileName: string;
   isChurchProgram?: boolean;
}
abstract class Program {
   private readonly name: string;
   private readonly id: string;
   private readonly fileName: string;
   readonly isChurchProgram: boolean;

   isOpened: boolean = false;

   setVisibility!: (newVal: boolean) => void;
   constructor({ name, id, fileName, isChurchProgram = false }: ProgramType) {
      this.name = name;
      this.id = id;
      this.fileName = fileName;
      this.isChurchProgram = isChurchProgram;

      this.createFile(isChurchProgram);

      const elemContent = this.instantiate();
      this.createElem(elemContent);

      Game.programs[id] = this;
   }

   private createElem(elemContent: JSX.Element): void {
      const elem = <ProgramElem id={this.id} name={this.name} isChurchProgram={this.isChurchProgram} program={this}>
         {elemContent}
      </ProgramElem>;

      const container = document.createElement("div");
      ReactDOM.render(elem, container);
      const computer = getElem("computer") as HTMLElement;
      computer.appendChild(container);
   }

   protected abstract instantiate(): JSX.Element;

   private createFile(isChurchProgram: boolean): void {
      const toggleProgramVisibility = (): void => {
         this.isOpened ? this.close() : this.open();
      }

      let extension!: "exe" | "holyc";
      if (isChurchProgram) {
         extension = "holyc";
      } else {
         extension = "exe";
      }

      createFile({
         name: this.fileName,
         extension: extension,
         clickEvent: toggleProgramVisibility
      });
   }

   open(): void {
      if (this.isOpened) return;
      this.isOpened = true;
      this.setVisibility(true);
   }

   close(): void {
      if (!this.isOpened) return;
      this.isOpened = false;
      this.setVisibility(false);
   }
}

export default Program;