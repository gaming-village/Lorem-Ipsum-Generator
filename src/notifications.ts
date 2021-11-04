import { getElem } from "./utils";

export interface NotificationInfo {
   iconSrc: string;
   title: string;
   description: string;
   caption?: string;
}

const closeNotification = (notification: HTMLElement): void => {
   notification.remove();
}

export function createNotification(info: NotificationInfo, isClickable: boolean = false, hasCloseButton: boolean = true): HTMLElement {
   const notification: HTMLElement = document.createElement("div");
   notification.className = `notification ${isClickable ? "clickable" : ""}`;
   getElem("notification-container").appendChild(notification);

   const iconSrc = require(`./images/icons/${info.iconSrc}`).default;
   
   notification.innerHTML = `
   <div class="top">
      <img src="${iconSrc}">
      <p class="title">${info.title}</p>
   </div>
   <p class="description">${info.description}</p>`;
   
   if (info.caption) {
      notification.innerHTML += `
      <div class="seperator"></div>
      <p class="caption">${info.caption}</p>`;
   }

   if (hasCloseButton) {
      const closeButton = document.createElement("img");
      closeButton.className = "close-icon";
      notification.appendChild(closeButton);

      const closeButtonSrc = require("./images/ui/close.png").default;
      closeButton.src = closeButtonSrc;

      closeButton.addEventListener("click", () => closeNotification(notification));
   }

   return notification;
}