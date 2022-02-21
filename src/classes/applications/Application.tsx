import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { focusProgram } from "../../pages/Home";
import { createFile } from "../../components/FileSystem";
import WindowsProgram from "../../components/WindowsProgram";
import Game from "../../Game";
import { getElem } from "../../utils";

interface TaskbarIconProps {
   name: string;
   application: Application;
}
const TaskbarIcon = ({ name, application }: TaskbarIconProps): JSX.Element => {
   const [opened, setOpened] = useState<boolean>(false);

   const clickEvent = () => {
      if (application.isOpened) {
         application.close();
      } else {
         application.open();
      }
   }

   application.setTaskbarStatus = (newVal: boolean) => {
      setOpened(newVal);
   }

   let className = "taskbar-icon";
   if (opened) className += " opened";
   return <div className={className} onClick={() => clickEvent()}>
      <div className="img"></div>
      <p>{name}</p>
   </div>;
}

interface ApplicationElemProps {
   title: string;
   id: string;
   application: Application;
   children?: JSX.Element;
}
const ApplicationElem = ({ title, id, application, children }: ApplicationElemProps): JSX.Element => {
   const [visible, setVisible] = useState<boolean>(false);
   const applicationRef = useRef(null);

   useEffect(() => {
      if (applicationRef.current) focusProgram(applicationRef.current);
      if (application.isOpened) setVisible(true);
   }, [application.isOpened]);

   application.setVisibility = (newVal: boolean): void => {
      setVisible(newVal);
   }

   const minimizeFunc = () => application.close();
   
   return visible ? (
      <WindowsProgram ref={applicationRef} title={title} id={id} uiButtons={["minimize"]} isDraggable={true} minimizeFunc={minimizeFunc}>
         {children}
      </WindowsProgram>
   ) : <></>;
}

export enum ApplicationCategory {
   lifestyle = "Lifestyle",
   utility = "Utility"
}
interface ApplicationType {
   name: string;
   id: string;
   fileName: string;
   category: ApplicationCategory;
   description: string;
   iconSrc: string | null;
   cost: number;
   isUnlocked: boolean;
   isOpenByDefault?: boolean;
}
abstract class Application {
   private readonly name: string;
   private readonly id: string;
   private readonly fileName: string;
   readonly category: ApplicationCategory;
   readonly description: string;
   readonly iconSrc: string | null;
   readonly cost: number;

   setVisibility!: (newVal: boolean) => void;
   setTaskbarStatus!: (newVal: boolean) => void;

   isUnlocked: boolean;
   isOpened: boolean;
   constructor({ name, id, fileName, category, description, iconSrc, cost, isUnlocked, isOpenByDefault = false }: ApplicationType) {
      this.name = name;
      this.id = id;
      this.fileName = fileName;
      this.category = category;
      this.description = description;
      this.iconSrc = iconSrc;
      this.cost = cost;
      this.isUnlocked = isUnlocked;
      this.isOpened = isOpenByDefault;

      if (this.isUnlocked) {
         this.createTaskbarIcon();
         this.createFile();
      }

      const elemContent = this.instantiate();
      this.createElem(elemContent);
      
      Game.applications[id] = this;
   }

   private createElem(elemContent: JSX.Element): void {
      const elem = <ApplicationElem id={this.id} title={this.name} application={this}>
         {elemContent}
      </ApplicationElem>;

      const container = document.createElement("div");
      ReactDOM.render(elem, container);
      const computer = getElem("computer") as HTMLElement;
      computer.appendChild(container);
   }

   protected abstract instantiate(): JSX.Element;

   private createTaskbarIcon(): void {
      const taskbar = getElem("taskbar") as HTMLElement;

      const icon = <TaskbarIcon name={this.name} application={this} />

      const container = document.createElement("div");
      container.style.display = "inline";
      ReactDOM.render(icon, container);
      taskbar.appendChild(container);
   }

   private createFile(): void {
      const toggleApplicationVisibility = (): void => {
         this.isOpened ? this.close() : this.open();
      }
      
      createFile({
         name: this.fileName,
         extension: "exe",
         clickEvent: toggleApplicationVisibility
      });
   }

   unlock(): void {
      if (this.isUnlocked) return;

      this.isUnlocked = true;
      this.createTaskbarIcon();
      this.createFile();
   }

   open() {
      if (this.isOpened) return;

      this.isOpened = true;
      this.setVisibility(true);
      this.setTaskbarStatus(true);
   }

   close() {
      if (!this.isOpened) return;

      this.isOpened = false;
      this.setVisibility(false);
      this.setTaskbarStatus(false);
   }
}

export default Application;