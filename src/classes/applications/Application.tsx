import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { focusProgram } from "../../pages/Home";
import { createFile } from "../../components/FileSystem";
import WindowsProgram from "../../components/WindowsProgram";
import Game from "../../Game";
import { getElem } from "../../utils";
import { ApplicationInfo } from "../../data/application-data";

interface TaskbarIconProps {
   name: string;
   application: Application;
}
const TaskbarIcon = ({ name, application }: TaskbarIconProps): JSX.Element => {
   const [opened, setOpened] = useState<boolean>(application.isOpened);

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
      <WindowsProgram ref={applicationRef} title={title} id={id} uiButtons={["minimize"]} isDraggable startsAtTopLeft minimizeFunc={minimizeFunc}>
         {children}
      </WindowsProgram>
   ) : <></>;
}

abstract class Application {
   readonly info: ApplicationInfo;

   setVisibility!: (newVal: boolean) => void;
   setTaskbarStatus!: (newVal: boolean) => void;

   isOpened: boolean;
   constructor(info: ApplicationInfo) {
      this.info = info;
      this.isOpened = typeof info.isOpenByDefault !== "undefined" ? info.isOpenByDefault : false;

      if (info.isUnlocked) {
         this.createTaskbarIcon();
         this.createFile();
      }

      const elemContent = this.instantiate();
      this.createElem(elemContent);
      
      Game.applications[info.className] = this;
   }

   private createElem(elemContent: JSX.Element): void {
      const elem = <ApplicationElem id={this.info.className} title={this.info.name} application={this}>
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

      const icon = <TaskbarIcon name={this.info.name} application={this} />

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
         name: this.info.fileName,
         extension: "exe",
         clickEvent: toggleApplicationVisibility
      });
   }

   unlock(): void {
      if (this.info.isUnlocked) return;

      this.info.isUnlocked = true;
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