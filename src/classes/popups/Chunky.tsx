import { useCallback, useState } from "react";

import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";

import Popup from "./Popup";
import { clamp, randInt } from "../../utils";

import WarningImage from "../../images/icons/warning.png";

// TODO: https://www.google.com/search?q=chunky+transparent+png&tbm=isch&ved=2ahUKEwipu_Cnqrj2AhUrUWwGHZ2kD9IQ2-cCegQIABAA&oq=chunky+transparent+png&gs_lcp=CgNpbWcQA1CvBljZCmCrC2gAcAB4AIABywGIAbAIkgEFMC41LjGYAQCgAQGqAQtnd3Mtd2l6LWltZ8ABAQ&sclient=img&ei=oj8oYqniGauiseMPncm-kA0&bih=882&biw=1680&rlz=1C5CHFA_enAU846AU846&safe=active&ssui=on#imgrc=7DFdvfjGu43zxM

enum Mood {
   appeased = "#00ff0d",
   dissatisfied = "#b3ff00",
   angry = "#ffe70a",
   fuming = "#ff800a",
   enraged = "#c90000"
}

const getChunkyMood = (rage: number): [Mood, string] => {
   const numMoods = Object.keys(Mood).length;
   const idx = Math.floor(rage * (numMoods - 1) / 100);
   
   const moodName = Object.keys(Mood)[idx] as keyof typeof Mood;
   const mood = Mood[moodName];

   return [mood, moodName];
}

/** How angry chunky is. At 100% chunky will become enraged. */
let chunkyRage = 0;

interface ElemProps {
   popup: Chunky;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const [rage, setRage] = useState(chunkyRage);
   const [hasPressedButton, setHasPressedButton] = useState(false);

   const [mood, moodName]: [Mood, string] = getChunkyMood(rage);

   const clickEvent = useCallback(() => {
      setHasPressedButton(true);

      const WAIT_TIME = 2000;
      setTimeout(() => {
         popup.close();
      }, WAIT_TIME);
   }, [popup]);

   const appease = useCallback(() => {
      const RAGE_DECREASE_RANGE: [number, number] = [15, 30];
      const decreaseAmount = randInt(...RAGE_DECREASE_RANGE);

      setRage(clamp(rage - decreaseAmount, 0, 100));
      clickEvent();
   }, [clickEvent, rage]);

   const close = useCallback(() => {
      const RAGE_INCREASE_RANGE: [number, number] = [10, 20]
      const increaseAmount = randInt(...RAGE_INCREASE_RANGE);

      setRage(clamp(rage + increaseAmount, 0, 100));
      clickEvent();
   }, [clickEvent, rage]);

   return <>
      <div className="warning-container">
         <img src={WarningImage} alt="Warning!" />
         <p>Looks like Chunky found a virus!</p>
      </div>

      <ProgressBar progress={rage} start={0} end={100} showProgress />

      <p className="mood">{hasPressedButton ? (
         <span style={{color: mood}}>Chunky is {moodName}.</span>
      ) : (
         <span>[ ... ]</span>
      )}</p>

      <div className="button-container">
         <Button onClick={!hasPressedButton ? appease : undefined} isDark={hasPressedButton}>Appease</Button>
         <Button onClick={!hasPressedButton ? close : undefined} isDark={hasPressedButton}>Close</Button>
      </div>
   </>;
}

class Chunky extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }
}

export default Chunky;