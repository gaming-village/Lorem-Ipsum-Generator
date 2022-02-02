import React, { useState } from "react";
import Game from "../../Game";
import { roundNum } from "../../utils";
import Application from "./Application";

interface ElemProps {
   application: LoremCounter;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [lorem, setLorem] = useState(Game.lorem);

   application.updateLoremCount = (newVal: number): void => {
      setLorem(newVal);
   };

   return <>
      <p>Lorem: {roundNum(lorem)}</p>
   </>;
}

class LoremCounter extends Application {
   updateLoremCount!: (newVal: number) => void;

   constructor() {
      super("Lorem Counter", "loremCounter", "i count lorem", 0);
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default LoremCounter;