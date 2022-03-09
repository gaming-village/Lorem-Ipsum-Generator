import { useCallback, useEffect, useState } from "react";

import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";

import Game from "../../Game";
import { clamp, randFloat } from "../../utils";
import Popup from "./Popup";

interface ElemProps {
   popup: RAMDownload;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   // The timer's progress in seconds
   const [time, setTime] = useState(0);
   const [timerIsStarted, setTimerIsStarted] = useState(false);

   const incrementTime = useCallback(() => {
      let newTime = time + 1 / Game.tps;

      if (Math.random() < 10 / Game.tps) {
         newTime += randFloat(-1.5, 1.5);
      }
      if (Math.random() < 0.5 / Game.tps) {
         newTime += randFloat(-8, 8);
      }
      if (Math.random() < 0.2 / Game.tps) {
         newTime = randFloat(0, 20);
      }
      if (Math.random() < 0.1 / Game.tps) {
         newTime = 20;
      }

      newTime = clamp(0, newTime, 20);

      setTime(newTime);
   }, [time]);

   const startDownload = (): void => {
      Game.createRenderListener(incrementTime);
      setTimerIsStarted(true);
   }

   useEffect(() => {
      if (timerIsStarted) Game.createRenderListener(incrementTime);
      
      return () => {
         if (Game.hasRenderListener(incrementTime)) Game.removeRenderListener(incrementTime);
      }
   }, [incrementTime, timerIsStarted]);

   const reachTime = useCallback(() => {
      Game.removeRenderListener(incrementTime);

      const WAIT_TIME = 2000;
      setTimeout(() => {
         const elem = popup.getElem();
         elem.classList.add("hiding");

         const ANIMATION_DURATION = 1000;
         setTimeout(() => {
            popup.close();
         }, ANIMATION_DURATION);
      }, WAIT_TIME);
   }, [incrementTime, popup]);

   useEffect(() => {
      if (time >= 20) reachTime();
   }, [time, reachTime]);

   return <>
      <p style={{textAlign: "center"}}><b>Limited timed offer!</b></p>

      <p>Download several free 32 RAMs into your Laptop for free viruse!</p>

      <ProgressBar start={0} end={20} progress={time} showProgress />

      <Button onClick={!timerIsStarted ? startDownload : undefined} isDark={timerIsStarted && time < 20} isCentered>{!timerIsStarted ? "Download free RAM" : time < 20 ? "Downloading..." : "Done!"}</Button>
   </>;
}

class RAMDownload extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }
}

export default RAMDownload;