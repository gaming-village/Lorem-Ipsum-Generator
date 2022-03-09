import { useCallback, useEffect, useState } from "react";

import PlantationTree from "../../images/miscellaneous/plantation-tree.png";
import BananaImg from "../../images/miscellaneous/banana.png";

import Popup from "./Popup";
import Game from "../../Game";
import { Point, randFloat, randInt, roundNum } from "../../utils";

interface BananaElemProps {
   squashFunc: () => void;
   pos: Point;
}
const BananaElem = ({ squashFunc, pos }: BananaElemProps): JSX.Element => {
   const animType = randInt(1, 4);
   const style: React.CSSProperties = {
      left: pos.x + "%",
      top: pos.y + "%",
      animationDuration: animType === 1 ? randFloat(2, 5) + "s" : randFloat(1, 2) + "s"
   };

   const className = "banana anim-" + animType;
   return <img onClick={squashFunc} style={style} className={className} src={BananaImg} alt="banan" />;
}

const createBananas = (squashFunc: (banana: JSX.Element) => void): Array<JSX.Element> => {
   const newBananas = new Array<JSX.Element>();

   const BANANA_COUNT = randInt(10, 20);
   for (let i = 0; i < BANANA_COUNT; i++) {
      const pos = new Point(
         randFloat(0, 100),
         randFloat(0, 100)
      );

      let currentBanana: JSX.Element;

      const squash = (): void => {
         squashFunc(currentBanana);
      }

      currentBanana = <BananaElem squashFunc={squash} pos={pos} key={i} />;
      newBananas.push(currentBanana);
   }

   return newBananas;
}

let bananaBuffer: Array<JSX.Element> = new Array<JSX.Element>();
interface ElemProps {
   popup: ChunkyPlantation;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const close = useCallback(() => {
      const WAIT_TIME = 2000;
      setTimeout(() => {
         popup.close();
      }, WAIT_TIME);
   }, [popup]);

   const succeed = (): void => {
      setHasSucceeded(true);

      close();
   }
   const fail = useCallback(() => {
      close();
   }, [close]);

   const squashBanana = (banana: JSX.Element): void => {
      bananaBuffer.splice(bananaBuffer.indexOf(banana), 1);
      setBananas(bananaBuffer.slice());

      if (bananaBuffer.length === 0) {
         succeed();
      }
   }

   const STARTING_TIME = 15;
   const [time, setTime] = useState(STARTING_TIME);
   const [bananas, setBananas] = useState<Array<JSX.Element>>(new Array<JSX.Element>());
   const [hasSucceeded, setHasSucceeded] = useState<boolean>(false);

   useEffect(() => {
      bananaBuffer = createBananas(squashBanana);
      setBananas(bananaBuffer.slice());
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const updateTime = useCallback(() => {
      const newTime = time - 1 / Game.tps;

      if (newTime <= 0) {
         Game.removeRenderListener(updateTime);
         fail();
      } else {
         setTime(newTime);
      }
   }, [fail, time]);

   useEffect(() => {
      Game.createRenderListener(updateTime);

      return () => {
         Game.removeRenderListener(updateTime);
      }
   }, [updateTime]);

   return <>
      <img src={PlantationTree} className="tree" alt="The Tree of Chunk" />

      {hasSucceeded ? (
         <div className="success-message">You gathered all bananas!</div>
      ) : (
         <div className="remaining-time">{roundNum(time, 1, true)} seconds remaining</div>
      )}

      {bananas}
   </>;
}

class ChunkyPlantation extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }
}

export default ChunkyPlantation;