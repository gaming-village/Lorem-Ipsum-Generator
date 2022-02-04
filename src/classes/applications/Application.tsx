import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { focusProgram } from "../..";
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
   });

   application.setVisibility = (newVal: boolean): void => {
      setVisible(newVal);
   }

   const minimizeFunc = () => application.close();
   
   return visible ? (
      <WindowsProgram ref={applicationRef} title={title} id={id} hasMinimizeButton={true} isDraggable={true} minimizeFunc={minimizeFunc}>
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
   category: ApplicationCategory;
   description: string;
   iconSrc: string | null;
   cost: number;
   isUnlocked: boolean;
}
abstract class Application {
   private readonly name: string;
   private readonly id: string;
   readonly category: ApplicationCategory;
   readonly description: string;
   readonly iconSrc: string | null;
   readonly cost: number;

   setVisibility!: (newVal: boolean) => void;
   setTaskbarStatus!: (newVal: boolean) => void;

   isUnlocked: boolean;
   isOpened: boolean = false;
   constructor({ name, id, category, description, iconSrc, cost, isUnlocked }: ApplicationType) {
      this.name = name;
      this.id = id;
      this.category = category;
      this.description = description;
      this.iconSrc = iconSrc;
      this.cost = cost;
      this.isUnlocked = isUnlocked;

      if (this.isUnlocked) this.createTaskbarIcon();

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

   unlock(): void {
      if (this.isUnlocked) return;

      this.isUnlocked = true;
      this.createTaskbarIcon();
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