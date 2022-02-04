import React, { useState } from "react";
import Game from "../../Game";
import { roundNum } from "../../utils";
import Application, { ApplicationCategory } from "./Application";

interface ElemProps {
   application: LoremCounter;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [lorem, setLorem] = useState(Game.lorem);

   application.updateLoremCount = (newVal: number): void => {
      setLorem(newVal);
   };

   return <>
      <p>{roundNum(lorem)} lorem</p>
   </>;
}

class LoremCounter extends Application {
   updateLoremCount!: (newVal: number) => void;

   constructor() {
      super({
         name: "Lorem Counter",
         id: "loremCounter",
         category: ApplicationCategory.lifestyle,
         description: "Counts your lorem.",
         iconSrc: "lorem-counter.png",
         cost: 0,
         isUnlocked: true
      });

      super.open();
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default LoremCounter;