import { useCallback, useEffect, useRef, useState } from "react";

import Button from "../../components/Button";

import Popup from "./Popup";
import Game from "../../Game";
import { getElem, Point, roundNum } from "../../utils";

enum Stage {
   Waiting,
   Expanding,
   Finished
}

interface ElemProps {
   popup: Expandinator;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const [time, setTime] = useState(2.5);
   const [stage, setStage] = useState(Stage.Waiting);
   const initialWidth = useRef<number | null>(null);
   const initialHeight = useRef<number | null>(null);
   const initialPos = useRef<Point | null>(null);

   useEffect(() => {
      if (typeof popup.getElem !== "undefined") {
         const elem = popup.getElem();
         
         initialWidth.current = elem.offsetWidth;
         initialHeight.current = elem.offsetHeight;
      }
   }, [popup, popup.getElem]);

   const close = (): void => {
      popup.close();
   }

   const startExpanding = (): void => {
      setStage(Stage.Expanding);
   }

   const updateTime = useCallback(() => {
      const newTime = time - 1 / Game.tps;
      setTime(newTime);

      if (newTime <= 0) {
         // Number of seconds until the popup finishes expanding
         const ENDING_TIME = 5;

         if (stage === Stage.Waiting) {
            // Start expanding
            startExpanding();
         } else if (newTime > -ENDING_TIME) {
            // If already expanding

            const elem = popup.getElem();

            if (initialPos.current === null) {
               initialPos.current = new Point(
                  elem.offsetLeft,
                  elem.offsetTop
               );
            }

            const computer = getElem("computer");
            const finalWidth = computer.offsetWidth;
            const finalHeight = computer.offsetHeight;

            const progress = -newTime / ENDING_TIME;

            elem.style.width = initialWidth.current! * (1 - progress) + finalWidth * progress + "px";
            elem.style.height = initialHeight.current! * (1 - progress) + finalHeight * progress + "px";

            elem.style.left = initialPos.current!.x * (1 - progress) + "px";
            elem.style.top = initialPos.current!.y * (1 - progress) + "px";
         } else {
            setStage(Stage.Finished);

            Game.removeRenderListener(updateTime);
         }
      }
   }, [time, stage, popup]);

   useEffect(() => {
      Game.createRenderListener(updateTime);

      return () => {
         Game.removeRenderListener(updateTime);
      }
   }, [updateTime]);

   return <div className={`content${stage !== Stage.Waiting && time <= -1 / Game.tps ? " expanding" : ""}`}>
      <p><b>He expanding.</b></p>

      <p className="time-remaining">{roundNum(Math.max(time, 0), undefined, true)}</p>

      <Button onClick={close} isCentered>Close</Button>
   </div>;
}

class Expandinator extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />
   }
}

export default Expandinator;