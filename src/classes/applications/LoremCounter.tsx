import React from "react";
import Application from "./Application";

class LoremCounter extends Application {
   constructor() {
      super("Lorem Counter", "lorem-counter", "i count lorem", 0);
   }

   instantiate(): JSX.Element {
      return <div>
         <p>Test!</p>
      </div>
   }
}

export default LoremCounter;