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
      <p>Lorem: {roundNum(lorem)}</p>
   </>;
}

class LoremCounter extends Application {
   updateLoremCount!: (newVal: number) => void;

   constructor() {
      super({
         name: "Lorem Counter",
         id: "loremCounter",
         category: ApplicationCategory.lifestyle,
         description: "i count lorem",
         cost: 0
      });
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default LoremCounter;