import Popup from "./Popup";

import FlushedFace from "../images/miscellaneous/flushed.png";
import WarningIcon from "../images/icons/warning.png";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import Game from "../Game";
import { roundNum } from "../utils";

interface ElemProps {
   application: LuremImpsir;
}
const Elem = ({ application }: ElemProps) => {
   const STOP_DURATION = 5;
   const [time, setTime] = useState(STOP_DURATION);

   useEffect(() => {
      const loremContainer = document.getElementById("lorem-container")!;
      loremContainer.classList.add("blocked");

      const updateTimer = (): void => {
         const newTime = time - 1 / Game.tps;
         
         setTime(newTime);
      }

      Game.createRenderListener(updateTimer);

      return () => {
         loremContainer.classList.remove("blocked");

         if (Game.hasRenderListener(updateTimer)) Game.removeRenderListener(updateTimer);
      }
   }, [time]);

   return <>
      <div className="warning-container">
         <img src={WarningIcon} alt={"Warning!"} />

         <p>Oops!</p>
      </div>

      <img className="flushed-face" src={FlushedFace} alt="flushed face O_O kinda sus bro" />

      <p>Looks like you're trying to lore impsus! Unfortunatly due to sadness you cannot lorm ismup.</p>

      <p>No lorme can be done until you are close?</p>

      <p>Try agian in the 5 seconds.</p>

      <Button onClick={time > 0 ? undefined : () => application.close()} isCentered isDark={time > 0}><>continue {time > 0 ? <i>{"(" + roundNum(time, undefined, true) + ")"}</i> : ""}</></Button>
   </>
}

class LuremImpsir extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem application={this} />
   }
}

export default LuremImpsir;