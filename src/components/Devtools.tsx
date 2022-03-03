import React, { useEffect, useRef, useState } from 'react';

import Game from '../Game';
import Button from './Button';
import ButtonContainer from './ButtonContainer';
import TitleBar from './TitleBar';

import "../css/devtools.css";
import DevtoolsIcon from '../images/icons/settings.png';

export let toggleDevtools: (() => void) | null = null;

const Devtools = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [openedTabs, setOpenedTabs] = useState<Array<string>>([""]);
   const packetInputRef = useRef<HTMLInputElement>(null);
   const loremInputRef = useRef<HTMLInputElement>(null);

   const reset = (): void => {
      Game.reset();
   }

   useEffect(() => {
      const hideDevtools = (): void => {
         Game.hideMask();
         Game.unblurScreen();
         Game.isInFocus = false;
         setIsVisible(false);

         Game.maskClickEvent = undefined;
      }
      const showDevtools = (): void => {
         Game.showMask();
         Game.blurScreen();
         Game.isInFocus = true;
         setIsVisible(true);

         Game.maskClickEvent = () => {
            hideDevtools();
         };
      }
      
      toggleDevtools = () => {
         const newVisible = !isVisible;

         newVisible ? showDevtools() : hideDevtools();
      }
   }, [isVisible]);

   const toggleTab = (newTab: string): void => {
      const newOpenedTabs = openedTabs.slice();
      if (newOpenedTabs.includes(newTab)) {
         // Remove tab
         newOpenedTabs.splice(newOpenedTabs.indexOf(newTab), 1);
      } else {
         // Add tab
         newOpenedTabs.push(newTab);
      }
      setOpenedTabs(newOpenedTabs);
   }

   const addLorem = (): void => {
      const input = loremInputRef.current;
      if (input !== null) {
         const amount = Number(input.value);
         
         if (!isNaN(amount)) {
            Game.lorem += amount;
         }
      }
   }
   const setLorem = (): void => {
      const input = loremInputRef.current;
      if (input !== null) {
         const amount = Number(input.value);

         if (!isNaN(amount)) {
            Game.lorem = amount;
         }
      }
   }

   const addPackets = (): void => {
      const input = packetInputRef.current;
      if (input !== null) {
         const amount = Number(input.value);
         
         if (!isNaN(amount)) {
            Game.packets += amount;
         }
      }
   }
   const setPackets = (): void => {
      const input = packetInputRef.current;
      if (input !== null) {
         const amount = Number(input.value);

         if (!isNaN(amount)) {
            Game.packets = amount;
         }
      }
   }

   return isVisible ? (
      <div id="devtools" className="windows-program">
         <TitleBar title="Devtools" iconSrc={DevtoolsIcon} uiButtons={[]} isDraggable={false} />

         <h2 onClick={() => toggleTab("resources")}>Resources</h2>

         <div className={!openedTabs.includes("resources") ? "hidden" : ""}>
            <p>Add or set the lorem count.</p>
            <input ref={loremInputRef} />
            <ButtonContainer>
               <>
                  <Button onClick={addLorem}>Add</Button>
                  <Button onClick={setLorem}>Set</Button>
               </>
            </ButtonContainer>

            <p>Add or set the packet count.</p>
            <input ref={packetInputRef} />
            <ButtonContainer>
               <>
                  <Button onClick={addPackets}>Add</Button>
                  <Button onClick={setPackets}>Set</Button>
               </>
            </ButtonContainer>
         </div>

         <h2 onClick={() => toggleTab("mail")}>Mail</h2>

         <div className={!openedTabs.includes("mail") ? "hidden" : ""}>
            <p>Receive letter</p>

            <select className="letter-select" name="Letters"></select>

            <Button className="receive-letter-button">Receive</Button>

            <p>Receive all letters</p>
            <Button className="receive-all-letters-button">Receive all</Button>
         </div>

         <h2 onClick={() => toggleTab("data")}>Data</h2>

         <div className={!openedTabs.includes("data") ? "hidden" : ""}>
            <Button onClick={reset} isCentered>Reset</Button>
         </div>
      </div>
   ) : <></>;
}

export default Devtools