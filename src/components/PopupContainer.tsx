import React, { useEffect, useState } from 'react';
import POPUP_DATA, { PopupInfo } from '../data/popup-data';
import Popup from '../popups/Popup';

export let createPopup: ((popup: PopupInfo) => void) | null = null;

setTimeout(() => {
   if (createPopup !== null) createPopup(POPUP_DATA[0]);
}, 500);

const PopupContainer = () => {
   const [popups, setPopups] = useState<Array<Popup>>([]);

   useEffect(() => {
      createPopup = (popupInfo: PopupInfo): void => {
         if (popupInfo.className === "") return;
         console.log(popupInfo.name);

         const popupClass = require("../popups/" + popupInfo.className).default;
         const popup = new popupClass(popupInfo);

         const newPopups = popups.slice();
         newPopups.push(popup);
         setPopups(newPopups);
      }

   }, [popups]);

   return (
      <div id="popup-container">
         {popups.map((popup, i) => {
            // const a = popup.createElem(i);
            // console.log(a.key);
            return popup.createElem(i);
         })}
      </div>
   );
}

export default PopupContainer;