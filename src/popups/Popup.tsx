import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import WindowsProgram from "../components/WindowsProgram";
import POPUP_DATA, { PopupInfo } from "../data/popup-data";
import QuestionmarkIcon from '../images/icons/questionmark.png';
import { CustomAudio, getElem, Point, randFloat } from "../utils";

let popupKey = 0;
const popups = new Array<Popup>();

const updateVisiblePopups = (): void => {
   const container = document.getElementById("popup-container");
   ReactDOM.render(<>
      {popups.map(popup => popup.elem)}
   </>, container);
}

const createPopup = (popupInfo: PopupInfo): void => {
   const popupClass = require("../popups/" + popupInfo.className).default;
   new popupClass(popupInfo);
}

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
   /** % of each side where the popup won't spawn */
   const padding = 5;

   const startPos = new Point(
      randFloat(padding, 100 - padding),
      randFloat(padding, 100 - padding)
   );

   const [pos, setPos] = useState<Point>(startPos);
   const elemRef = useRef(null);

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

      application.move = (): void => {
         setPos(new Point(
            randFloat(padding, maxLeft),
            randFloat(padding, maxTop)
         ));
      }

      const newPos = new Point(pos.x, pos.y);

      if (pos.x > maxLeft) {
         newPos.x = maxLeft;
      }
      if (pos.y > maxTop) {  
         newPos.y = maxTop;
      }

      setPos(new Point(
         maxLeft,
         maxTop
      ));
   // eslint-disable-next-line
   }, []);

   let iconSrc!: string;
   try {
      iconSrc = require("../images/popup-icons/" + info.iconSrc).default;
   } catch {
      iconSrc = QuestionmarkIcon;
   }

   const style: React.CSSProperties = {
      width: info.elemDimensions?.width,
      height: info.elemDimensions?.height,
      left: pos.x + "%",
      top: pos.y + "%"
   };
   
   return <WindowsProgram ref={elemRef} style={style} className={`popup ${info.name}`} title={info.name} titleIconSrc={iconSrc}>
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

      // Play ding sound
      new CustomAudio("ding.wav");
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

   close(playAudio: boolean = true): void {
      if (typeof this === "undefined") {
         throw new Error("'this' keyword is undefined! You're probably not using an arrow function somewhere");
      }

      // Play close sound
      if (playAudio) new CustomAudio("popup-close.mp3");

      removePopup(this);

      updateVisiblePopups();
   }

   move!: () => void;
}

export default Popup;