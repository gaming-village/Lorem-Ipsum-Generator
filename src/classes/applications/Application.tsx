import { useState } from "react";
import ReactDOM from "react-dom";
import Program from "../../components/Program";
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
   application: Application;
   children?: JSX.Element;
}
const ApplicationElem = ({ title, application, children }: ApplicationElemProps): JSX.Element => {
   const [visible, setVisible] = useState<boolean>(false);

   application.setVisibility = (newVal: boolean): void => {
      setVisible(newVal);
   }

   const minimizeFunc = () => application.close();
   
   return visible ? (
      <Program title={title} hasMinimizeButton={true} isDraggable={true} minimizeFunc={minimizeFunc}>
         {children}
      </Program>
   ) : <></>;
}

abstract class Application {
   private readonly name: string;
   private readonly description: string;
   private readonly cost: number;
   private readonly id: string;

   setVisibility!: (newVal: boolean) => void;
   setTaskbarStatus!: (newVal: boolean) => void;

   isUnlocked: boolean = false;
   isOpened: boolean = false;
   constructor(name: string, id: string, description: string, cost: number) {
      this.name = name;
      this.description = description;
      this.id = id;
      this.cost = cost;

      const elemContent = this.instantiate();
      this.createElem(elemContent);

      this.createTaskbarIcon();

      Game.applications[id] = this;
   }

   private createElem(elemContent: JSX.Element): void {
      const elem = <ApplicationElem title={this.name} application={this}>
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
      ReactDOM.render(icon, container);
      taskbar.appendChild(container);
   }

   unlock(): void {
      if (this.isUnlocked) return;

      this.isUnlocked = true;
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