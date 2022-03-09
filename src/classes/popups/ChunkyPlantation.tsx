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
   const style: React.CSSProperties = {
      left: pos.x + "%",
      top: pos.y + "%"
   };

   return <img onClick={squashFunc} style={style} className="banana" src={BananaImg} alt="banan" />;
}

const createBananas = (squashFunc: (banana: JSX.Element) => void): Array<JSX.Element> => {
   // console.log("create");
   const bananas = new Array<JSX.Element>();

   const BANANA_COUNT = randInt(10, 20);
   for (let i = 0; i < BANANA_COUNT; i++) {
      const pos = new Point(
         randFloat(0, 100),
         randFloat(0, 100)
      );

      const squash = (): void => {
         squashFunc(bananas[i]);
      }

      bananas.push(
         <BananaElem squashFunc={squash} pos={pos} key={i} />
      );
   }

   return bananas;
}

interface ElemProps {
   popup: ChunkyPlantation;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const squashBanana = (banana: JSX.Element): void => {
      const newBananas = bananas.slice();
      newBananas.splice(newBananas.indexOf(banana), 1);
      setBananas(newBananas);
   }

   const STARTING_TIME = 15;
   const [time, setTime] = useState(STARTING_TIME);
   const [bananas, setBananas] = useState<Array<JSX.Element>>(createBananas(squashBanana));

   const updateTime = useCallback(() => {
      const newTime = time - 1 / Game.tps;

      if (newTime <= 0) {
         popup.close();
      } else {
         setTime(newTime);
      }
   }, [time, popup]);

   useEffect(() => {
      Game.createRenderListener(updateTime);

      return () => {
         Game.removeRenderListener(updateTime);
      }
   }, [updateTime]);

   return <>
      <img src={PlantationTree} className="tree" alt="The Tree of Chunk" />

      <div className="remaining-time">{roundNum(time, 1, true)} seconds remaining</div>

      {bananas}
   </>;
}

class ChunkyPlantation extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }
}

export default ChunkyPlantation;