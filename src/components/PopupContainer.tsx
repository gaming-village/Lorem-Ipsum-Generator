// import { useEffect, useState } from 'react';

// import POPUP_DATA, { PopupInfo } from '../data/popup-data';
// import Popup from '../popups/Popup';

// export let createPopup: ((popup: PopupInfo) => void) | null = null;

// let potentialPopups = new Array<PopupInfo>();

// const fillPotentialPopups = (): void => {
//    const newPotentialPopups = new Array<PopupInfo>();
//    for (const popup of POPUP_DATA) {
//       if (popup.isUnlocked && typeof popup.className !== "undefined") {
//          newPotentialPopups.push(popup);
//       }
//    }
//    potentialPopups = newPotentialPopups;
// }

// export function createRandomPopup(): void {
//    if (potentialPopups.length === 0) {
//       fillPotentialPopups();

//       if (potentialPopups.length === 0) {
//          return;
//       }
//    }

//    const idx = Math.floor(Math.random() * potentialPopups.length);
//    const popup = potentialPopups[idx];
//    potentialPopups.splice(idx, 1);

//    console.log("a");
//    createPopup!(popup);
// }

// interface PopupData {
//    popup: Popup;
//    top: 
// }
// let popupBuffer = new Array<PopupData>();
// const PopupContainer = () => {
//    const [popups, setPopups] = useState<Array<Popup>>([]);

//    const removePopup = (popup: Popup): void => {
//       const newPopups = popups.slice();
//       newPopups.splice(newPopups.indexOf(popup));
//       setPopups(newPopups);
//    }

//    useEffect(() => {
//       createPopup = (popupInfo: PopupInfo): void => {
//          if (popupInfo.className === "") return;

//          const popupClass = require("../popups/" + popupInfo.className).default;
//          const popup = new popupClass(popupInfo);

//          const newPopups = popups.slice();
//          newPopups.push(popup);
//          setPopups(newPopups);
//       }
//    }, [popups]);

//    return (
//       <div id="popup-container">
//          {popups.map((popup, i) => {
//             return popup.createElem(i, removePopup);
//          })}
//       </div>
//    );
// }

// export default PopupContainer;

export function awdaiwdawd() { return 1 }