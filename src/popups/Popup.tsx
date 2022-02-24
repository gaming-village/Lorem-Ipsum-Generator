import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import WindowsProgram from "../components/WindowsProgram";
import POPUP_DATA, { PopupInfo } from "../data/popup-data";
import QuestionmarkIcon from '../images/icons/questionmark.png';
import { getElem, randFloat } from "../utils";

let popupKey = 0;
const popups = new Array<Popup>();
const popupElems = new Array<JSX.Element>();

const updateVisiblePopups = (): void => {
   const container = document.getElementById("popup-container");
   ReactDOM.render(<>
      {popups.map(popup => popup.elem)}
      {popupElems.slice()}
   </>, container);
}

const createPopup = (popupInfo: PopupInfo): void => {
   const popupClass = require("../popups/" + popupInfo.className).default;
   new popupClass(popupInfo);
}

export function addPopupElem(elem: JSX.Element): void {
   popupElems.push(elem);
   updateVisiblePopups();
}
export function getPopupElemKey(): number {
   return popupKey++;
}
export function removePopupElem(elem: JSX.Element): void {
   popupElems.splice(popupElems.indexOf(elem), 1);
}

setTimeout(() => {
   createPopup(POPUP_DATA[5]);
}, 100);

const removePopup = (popup: Popup): void => {
   const idx = popups.indexOf(popup);
   popups.splice(idx, 1);
}

let potentialPopups = new Array<PopupInfo>();

const fillPotentialPopups = (): void => {
   const newPotentialPopups = new Array<PopupInfo>();
   for (const popup of POPUP_DATA) {
      if (popup.isUnlocked && typeof popup.className !== "undefined") {
         newPotentialPopups.push(popup);
      }
   }
   potentialPopups = newPotentialPopups;
}

export function createRandomPopup(): void {
   if (potentialPopups.length === 0) {
      fillPotentialPopups();

      if (potentialPopups.length === 0) {
         return;
      }
   }

   const idx = Math.floor(Math.random() * potentialPopups.length);
   const popup = potentialPopups[idx];
   potentialPopups.splice(idx, 1);

   createPopup(popup);
}

interface PopupElemInfo {
   info: PopupInfo;
   application: Popup;
   children: JSX.Element;
}
const PopupElem = ({ info, application, children }: PopupElemInfo) => {
   const elemRef = useRef(null);

   /** % of each side where the popup won't spawn */
   const padding = 5;

   const left = randFloat(padding, 100 - padding);
   const top = randFloat(padding, 100 - padding);

   useEffect(() => {
      application.getElem = (): HTMLElement => {
         return elemRef.current!;
      }

      // Position the popup at a random position in the screen
      const elem = elemRef.current! as HTMLElement;

      const topbarHeight = getElem("top-bar").offsetHeight;

      const widthPercent = elem.offsetWidth / window.innerWidth * 100;
      const heightPercent = elem.offsetHeight / (window.innerHeight - topbarHeight) * 100;

      const maxLeft = 100 - padding - widthPercent;
      const maxTop = 100 - padding - heightPercent;

      if (left > maxLeft) {
         elem.style.left = maxLeft + "%";
      }
      if (top > maxTop) {  
         elem.style.top = maxTop + "%";
      }
   });

   let iconSrc!: string;
   try {
      iconSrc = require("../images/popup-icons/" + info.iconSrc).default;
   } catch {
      iconSrc = QuestionmarkIcon;
   }

   const style: React.CSSProperties = {
      width: info.elemDimensions?.width,
      height: info.elemDimensions?.height,
      left: left + "%",
      top: top + "%"
   };
   return <WindowsProgram ref={elemRef} style={style} className="popup" title={info.name} titleIconSrc={iconSrc}>
      {children}
   </WindowsProgram>;
}

abstract class Popup {
   private info: PopupInfo;
   elem!: JSX.Element;

   constructor(info: PopupInfo) {
      this.info = info;

      popups.push(this);

      this.createElem();
   }

   createElem(): void {
      const elemContent = this.instantiate();
      this.elem = <PopupElem key={popupKey++} info={this.info} application={this}>
         {elemContent}
      </PopupElem>;

      updateVisiblePopups();
   }

   getElem!: () => HTMLElement;

   protected abstract instantiate(): JSX.Element;

   close(): void {
      if (typeof this === "undefined") {
         throw new Error("'this' keyword is undefined! You're probably not using an arrow function somewhere");
      }

      removePopup(this);

      updateVisiblePopups();
   }
}

export default Popup;