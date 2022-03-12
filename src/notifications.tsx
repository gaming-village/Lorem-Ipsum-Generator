import React, { useEffect, useState } from "react";
import Button from "./components/Button";
import UIButton from "./components/UIButton";
import "./css/notifications.css";
import { CustomAudio } from "./utils";

export interface NotificationInfo {
   iconSrc: string;
   title: string;
   description: string;
   caption?: string;
   /** Whether the caption should flash red or not */
   captionIsFlashing?: boolean;
   isClickable?: boolean;
   hasCloseButton?: boolean;
   playSound?: boolean;
   onClick?: () => void;
}

interface NotificationProps {
   info: NotificationInfo;
   closeFunc: (info: NotificationInfo) => void;
   isClosing: boolean;
}
const Notification = ({ info, closeFunc, isClosing }: NotificationProps) => {
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

   let className = "notification";
   if (info.isClickable) className += " clickable";
   if (isClosing) className += " closing";

   return <div className={className}>
      <>
         <div className="top">
            <img src={iconSrc} alt="" />
            <p className="title">{info.title}</p>
         </div>
         <p className="description">{info.description}</p>
         
         {info.caption ? <>
            <div className="seperator"></div>
            <p className={`caption${info.captionIsFlashing ? " flashing" : ""}`} onClick={!isClosing ? clickEvent : undefined}>{info.caption}</p>
         </> : undefined}

         {info.hasCloseButton ? (
            <UIButton onClick={!isClosing ? () => closeFunc(info) : undefined} type="close" />
         ) : undefined}
      </>
   </div>;
}

export let createNotification: (info: NotificationInfo) => void;

let notificationBuffer = new Array<NotificationInfo>();
export const NotificationContainer = () => {
   const [notifications, setNotifications] = useState<Array<NotificationInfo>>(new Array<NotificationInfo>());
   const [closingNotification, setClosingNotification] = useState<NotificationInfo | null>(null);

   useEffect(() => {
      createNotification = (info: NotificationInfo): void => {
         // Play chimes sound
         if (typeof info.playSound !== "undefined" ? info.playSound : true) new CustomAudio("notification-receive.mp3");

         notificationBuffer.push(info);
         setNotifications(notificationBuffer.slice());
      };
   }, [notifications]);

   const closeFunc = (info: NotificationInfo): void => {
      // Play swoosh sound
      new CustomAudio("notification-close.mp3");

      setClosingNotification(info);
      
      const CLOSE_ANIMATION_DURATION = 400;
      setTimeout(() => {
         const idx = notificationBuffer.indexOf(info);
         notificationBuffer.splice(idx, 1);
         
         setNotifications(notificationBuffer.slice());
      }, CLOSE_ANIMATION_DURATION);
   }

   const closeAll = (): void => {
      notificationBuffer = new Array<NotificationInfo>();
      setNotifications(notificationBuffer.slice());
   }

   const MAX_NOTIFICATIONS = 4;
   return <div id="notification-container">
      {notifications.map((notification, i) => {
         return <Notification key={i} info={notification} closeFunc={closeFunc} isClosing={notification === closingNotification} />;
      })}
      {notifications.length > MAX_NOTIFICATIONS ? (
         <Button onClick={closeAll} isCentered>Close All</Button>
      ) : undefined}
   </div>;
}