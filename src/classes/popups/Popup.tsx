import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import WindowsProgram from "../../components/WindowsProgram";
import POPUP_DATA, { PopupInfo } from "../../data/popup-data";
import QuestionmarkIcon from '../../images/icons/questionmark.png';
import { CustomAudio, getElem, Point, randFloat } from "../../utils";

let popupKey = 0;
const popups = new Array<Popup>();

export function getPopups(): Array<Popup> {
   return popups;
}

const updateVisiblePopups = (): void => {
   const container = document.getElementById("popup-container");
   ReactDOM.render(<>
      {popups.map(popup => popup.elem)}
   </>, container);
}

export function showExistingPopups(): void {
   if (popups.length > 0) updateVisiblePopups();
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
      if (popup.isUnlocked && popup.className !== "") {
         // Make sure the popup isn't already visible if it's a single popup
         if (popup.elem.isSingleElem) {
            let hasFound = false;
            for (const currentPopup of popups) {
               if (currentPopup.name === popup.name)  {
                  hasFound = true;
                  break;
               }
            }
            if (hasFound) continue;
         }

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
   closeFunc?: () => void;
}
const PopupElem = ({ info, application, children, closeFunc }: PopupElemInfo) => {
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

      setPos(newPos);
   // eslint-disable-next-line
   }, []);

   let iconSrc!: string;
   try {
      iconSrc = require("../../images/popup-icons/" + info.iconSrc).default;
   } catch {
      iconSrc = QuestionmarkIcon;
   }

   const style: React.CSSProperties = {
      width: info.elem.dimensions?.width,
      height: info.elem.dimensions?.height,
      left: pos.x + "%",
      top: pos.y + "%"
   };
   
   return <WindowsProgram ref={elemRef} style={style} className={`popup ${info.name}`} title={info.elem.title} titleIconSrc={iconSrc} uiButtons={typeof closeFunc !== "undefined" ? ["close"] : []} closeFunc={closeFunc}>
      {children}
   </WindowsProgram>;
}

// setTimeout(() => {
//    const popupClassName = "RAMDownload";
//    for (const a of POPUP_DATA) {
//       if (a.className === popupClassName) {
//          createPopup(a);
//       }
//    }
// }, 100);

abstract class Popup {
   private info: PopupInfo;
   elem!: JSX.Element;
   name: string;

   constructor(info: PopupInfo) {
      this.info = info;
      this.name = info.name;

      popups.push(this);

      this.createElem();

      // Play ding sound
      new CustomAudio("ding.wav");
   }

   createElem(): void {
      const closeFunc = typeof this.closeButtonFunc !== "undefined" ? () => this.closeButtonFunc!() : undefined;

      const elemContent = this.instantiate();
      this.elem = <PopupElem key={popupKey++} info={this.info} application={this} closeFunc={closeFunc}>
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

   protected closeButtonFunc?(): void;
}

export default Popup;