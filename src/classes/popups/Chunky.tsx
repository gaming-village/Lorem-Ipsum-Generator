import { useCallback, useState } from "react";

import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";

import Game from "../../Game";
import Popup, { createPopup } from "./Popup";
import { clamp, randInt, randItem } from "../../utils";

import WarningImage from "../../images/icons/warning.png";
import POPUP_DATA, { PopupInfo } from "../../data/popup-data";

/** Gets all unlcked chunky popups */
const getAvailableChunkyPopups = (): ReadonlyArray<PopupInfo> | null => {
   const popups = new Array<PopupInfo>();

   for (const popup of POPUP_DATA) {
      if (popup.isUnlocked && popup.isChunkyPopup && popup.className !== "") {
         popups.push(popup);
      }
   }

   if (popups.length > 0) {
      return popups;
   }
   return null;
}

const showChunkyPopups = (): void => {
   const availablePopups = getAvailableChunkyPopups();
   
   if (availablePopups !== null) {
      const POPUP_AMOUNT = randInt(3, 5);
      for (let i = 0; i < POPUP_AMOUNT; i++) {
         const popupInfo = randItem(availablePopups);
         createPopup(popupInfo);
      }
   }
}

enum Mood {
   content = "#00ff0d",
   displeased = "#b3ff00",
   angry = "#ffe70a",
   fuming = "#ff800a",
   enraged = "#c90000"
}

const getChunkyMood = (rage: number): [Mood, string] => {
   const numMoods = Object.keys(Mood).length;
   const idx = Math.floor(rage * (numMoods - 1) / 100);
   
   const moodName = Object.keys(Mood)[idx] as keyof typeof Mood;
   const mood = Mood[moodName];

   return [mood, moodName];
}

const getChunkyImgSrc = (rage: number): string => {
   const i = Math.floor(rage * 3/100) + 1;
   return require(`../../images/miscellaneous/chunky${i}.png`).default;
}

/** How angry chunky is. At 100% chunky will become enraged. */
let chunkyRage = 0;

interface ElemProps {
   popup: Chunky;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const [rage, setRage] = useState(chunkyRage);
   const [hasPressedButton, setHasPressedButton] = useState(false);

   const [mood, moodName]: [Mood, string] = getChunkyMood(rage);

   const clickEvent = useCallback(() => {
      setHasPressedButton(true);

      const WAIT_TIME = 2000;
      setTimeout(() => {
         popup.close();
      }, WAIT_TIME);
   }, [popup]);

   const appease = useCallback(() => {
      const RAGE_DECREASE_RANGE: [number, number] = [15, 30];
      const decreaseAmount = randInt(...RAGE_DECREASE_RANGE);

      const newRage = clamp(rage - decreaseAmount, 0, 100);
      chunkyRage = newRage;
      setRage(newRage);

      showChunkyPopups();

      clickEvent();
   }, [clickEvent, rage]);

   const close = useCallback(() => {
      Game.lorem *= 1.1;

      const RAGE_INCREASE_RANGE: [number, number] = [10, 20]
      const increaseAmount = randInt(...RAGE_INCREASE_RANGE);

      const newRage = clamp(rage + increaseAmount, 0, 100);
      chunkyRage = newRage;
      setRage(newRage);

      clickEvent();
   }, [clickEvent, rage]);

   const chunkyImgSrc = getChunkyImgSrc(rage);

   return <>
      <div className="warning-container">
         <img src={WarningImage} alt="Warning!" />
         <p>Looks like Chunky found a virus!</p>
      </div>

      <img src={chunkyImgSrc} className="chunky-img" alt="He has arrived" />

      <ProgressBar progress={rage} start={0} end={100} showProgress />

      <p className="mood">{hasPressedButton ? (
         <span style={{color: mood}}>Chunky is {moodName}.</span>
      ) : (
         <span className="placeholder">[ Awaiting response... ]</span>
      )}</p>

      <div className="button-container">
         <Button onClick={!hasPressedButton ? appease : undefined} isDark={hasPressedButton}>Appease</Button>
         <Button onClick={!hasPressedButton ? close : undefined} isDark={hasPressedButton}>Close</Button>
      </div>
   </>;
}

class Chunky extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }
}

export default Chunky;