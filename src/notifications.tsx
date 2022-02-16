import React, { useEffect, useState } from "react";
import Button from "./components/Button";
import UIButton from "./components/UIButton";
import "./css/notifications.css";

export interface NotificationInfo {
   iconSrc: string;
   title: string;
   description: string;
   caption?: string;
   isClickable?: boolean;
   hasCloseButton?: boolean;
   onClick?: () => void;
}

interface NotificationProps {
   info: NotificationInfo;
   closeFunc: (info: NotificationInfo) => void;
}
const Notification = ({ info, closeFunc }: NotificationProps) => {
   let iconSrc;
   try {
      iconSrc = require(`./images/icons/${info.iconSrc}`).default;
   } catch {
      iconSrc = require("./images/icons/questionmark.png").default;
   }

   const clickEvent = (): void => {
      if (!info.onClick) return;
      
      closeFunc(info);
      info.onClick();
   }

   return <div className={`notification${info.isClickable ? " clickable" : ""}`}>
      <>
         <div className="top">
            <img src={iconSrc} alt="" />
            <p className="title">{info.title}</p>
         </div>
         <p className="description">{info.description}</p>
         
         {info.caption ?
         <>
            <div className="seperator"></div>
            <p className="caption" onClick={clickEvent}>{info.caption}</p>
         </>
         : ""}

         {info.hasCloseButton ?
         <UIButton onClick={() => closeFunc(info)} type="close" />
         : ""}
      </>
   </div>;
}

export let createNotification: (info: NotificationInfo) => void;

let notificationBuffer = new Array<NotificationInfo>();
export const NotificationContainer = () => {
   const [notifications, setNotifications] = useState<Array<NotificationInfo>>(new Array<NotificationInfo>());

   useEffect(() => {
      createNotification = (info: NotificationInfo): void => {
         notificationBuffer.push(info);
         setNotifications(notificationBuffer.slice());
      };
   }, [notifications]);

   const closeFunc = (info: NotificationInfo): void => {
      for (let i = 0; i < notificationBuffer.length; i++) {
         if (notificationBuffer[i] === info) {
            notificationBuffer.splice(i, 1);
         }
      }
      setNotifications(notificationBuffer.slice());
   }

   const closeAll = (): void => {
      notificationBuffer = new Array<NotificationInfo>();
      setNotifications(notificationBuffer.slice());
   }

   const MAX_NOTIFICATIONS = 4;
   return <div id="notification-container">
      {notifications.map((notification, i) => {
         return <Notification key={i} info={notification} closeFunc={closeFunc} />;
      })}
      {notifications.length > MAX_NOTIFICATIONS ? <Button onClick={closeAll} isCentered={true}>Close All</Button> : ""}
   </div>;
}