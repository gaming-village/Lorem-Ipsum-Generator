import { useState } from "react";

import Button from "../../components/Button";

import Popup from "./Popup";

import WarningImage from "../../images/icons/warning.png";
import ProgressBar from "../../components/ProgressBar";

// TODO: https://www.google.com/search?q=chunky+transparent+png&tbm=isch&ved=2ahUKEwipu_Cnqrj2AhUrUWwGHZ2kD9IQ2-cCegQIABAA&oq=chunky+transparent+png&gs_lcp=CgNpbWcQA1CvBljZCmCrC2gAcAB4AIABywGIAbAIkgEFMC41LjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=oj8oYqniGauiseMPncm-kA0&bih=882&biw=1680&rlz=1C5CHFA_enAU846AU846&safe=active&ssui=on#imgrc=7DFdvfjGu43zxM

enum Mood {
   Appeased,
   Dissatisfied,
   Angry,
   Fuming,
   Enraged
}

/** How angry chunky is. At 100% chunky will become enraged. */
let chunkyRage = 0;

const Elem = (): JSX.Element => {
   const [rage, setRage] = useState(chunkyRage);

   return <>
      <div className="warning-container">
         <img src={WarningImage} alt="Warning!" />
         <p>Looks like Chunky found a virus!</p>
      </div>

      <ProgressBar progress={rage} start={0} end={100} showProgress />

      <div className="button-container">
         <Button>Appease</Button>   
         <Button>Close</Button>   
      </div>
   </>
}

class Chunky extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem />;
   }
}

export default Chunky;