import { useState } from "react";
import { randItem } from "../../utils";

import WarningImg from "../../images/icons/warning.png";

import Popup from "./Popup";

type Reward = string | number;

const REWARD_DATA: ReadonlyArray<Reward> = [
   1,
   3,
   7,
   -1,
   -3,
   "Popup wave"
];

interface ElemProps {
   application: Visitor;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [reward, setReward] = useState<Reward | null>(null);

   const generateRandomReward = (): void => {
      const newReward = randItem(REWARD_DATA);
      setReward(newReward);
   }

   return <>
      <div className="warning-container">
         <img src={WarningImg} alt="Warning!" />
         <p></p>
      </div>

      <div className="rainbow-bg">
         <div className="box">
            
         </div>
      </div>
   </>;
}

class Visitor extends Popup {
   protected instantiate(): JSX.Element {
      throw new Error("Method not implemented.");
   }

}

export default Visitor;