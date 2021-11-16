import React from "react";
import ReactDOM from "react-dom";
import UIButton from "./components/UIButton";
import { getElem } from "./utils";

export interface NotificationInfo {
   iconSrc: string;
   title: string;
   description: string;
   caption?: string;
}

const getNotification = (notificationCount: number): HTMLElement => {
   return document.querySelector(`.notification-${notificationCount}`) as HTMLElement;
}

const closeNotification = (notification: HTMLElement): void => {
   notification.remove();
}

const generateNotificationID = (): number => {
   let i = 0;
   while (document.querySelector(`.notification-${i}`) !== null) {
      i++;
   }
   return i;
}

export function createNotification(info: NotificationInfo, isClickable: boolean = false, hasCloseButton: boolean = true, clickEvent?: Function): void {
   const wrapper = document.createElement("div");
   const notificationContainer = getElem("notification-container");
   notificationContainer.appendChild(wrapper);

   const notificationClickEvent = () => {
      if (clickEvent) {
         const notification = getNotification(notificationCount);
         if (notification) clickEvent(notification);
      }
   }

   const iconSrc = require(`./images/icons/${info.iconSrc}`).default;
   const notificationCount = generateNotificationID();
   const notification = <div onClick={notificationClickEvent} className={`notification notification-${notificationCount}${isClickable ? " clickable" : ""}`}>
      <>
         <div className="top">
            <img src={iconSrc} alt="" />
            <p className="title">{info.title}</p>
         </div>
         <p className="description">{info.description}</p>
         
         {info.caption ?
         <>
            <div className="seperator"></div>
            <p className="caption">{info.caption}</p>
         </>
         : ""}

         {hasCloseButton ?
         <UIButton onClick={() => closeNotification(getNotification(notificationCount))} type="close" />
         : ""}
      </>
   </div>

   ReactDOM.render(notification, wrapper);
}