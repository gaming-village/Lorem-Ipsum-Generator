import { useState } from "react";
import Button from "../../components/Button";
import WindowsProgram from "../../components/WindowsProgram";
import { CustomAudio, Point, randFloat, randInt, wait } from "../../utils";
import Popup from "./Popup";

import WarningIcon from "../../images/icons/warning.png";
import ReactDOM from "react-dom";
import Game from "../../Game";

const ERROR_TITLES = ["ERROR", "warning!!1!"];
interface ErrorPopupProps {
   startPos: Point;
   closeFunc: () => void;
}
const ErrorPopup = ( { startPos, closeFunc }: ErrorPopupProps) => {
   const style: React.CSSProperties = {
      top: startPos.y + randFloat(-15, 15) * 10 + "px",
      left: startPos.x + randFloat(-15, 15) * 10 + "px",
      transform: "translate(-50%, -50%)"
   };

   return <WindowsProgram closeFunc={() => closeFunc()} style={style} title={ERROR_TITLES[Math.floor(Math.random() * ERROR_TITLES.length)]} uiButtons={["close"]} titleIconSrc={WarningIcon}>
      <p style={{ fontWeight: 600, color: "#ff0000" }}>Incorrect!</p>
   </WindowsProgram>;
}

const createErrorPopups = async (elem: HTMLElement): Promise<void> => {
   const startPos = new Point(elem.offsetLeft + elem.offsetWidth/2, elem.offsetTop + elem.offsetHeight/2);

   await wait(100);

   const errorAmount = randInt(4, 8);
   for (let i = 0; i < errorAmount; i++) {
      await wait(randInt(20, 50));

      // Play the popup entrance sound when the elem appears
      new CustomAudio("ding.wav");

      const container = document.createElement("div");
      document.getElementById("computer")?.appendChild(container);

      const close = (): void => {
         // Play the close sound
         new CustomAudio("popup-close.mp3");

         ReactDOM.unmountComponentAtNode(container);
         container.remove();

         Game.lorem += 1;
      }

      const error = <ErrorPopup startPos={startPos} closeFunc={close} />;

      ReactDOM.render(error, container);
   }
}

enum ElemState {
   introduction,
   input
}

interface ElemProps {
   popup: AnnualSurvey;
}
const Elem = ({ popup }: ElemProps) => {
   const [state, setState] = useState<ElemState>(ElemState.introduction);

   const incrementState = (): void => {
      const newState = state + 1;
      setState(newState);
   }

   const close = (): void => {
      createErrorPopups(popup.getElem());
      popup.close();
   }

   let content!: JSX.Element;
   switch (state) {
      case ElemState.introduction: {
         content = <>
            <p>Dear Chroium user,</p>
            <p>You are todays lucky Visitor! <i>(June)</i></p>
            <p>Please complete this short survey and to say "Thanks You" we would offer the <b>50 dollers!</b></p>

            <Button onClick={incrementState} isCentered>Start survey</Button>
         </>
         break;
      }
      case ElemState.input: {
         content = <>
            <p>Answer these simepl questions to complete the it!</p>

            <label htmlFor="annual-survey-colour">What is your favourite colour?</label>
            <input name="annual-survey-colour" type="text" placeholder="e.g. apple" />

            <label htmlFor="annual-survey-when">When is it happening</label>
            <input name="annual-survey-when" type="text" placeholder="e.g. 20/13/2022" />

            <label htmlFor="annual-survey-how">HOW</label>
            <input name="annual-survey-how" type="text" placeholder="e.g. 8.29" />

            <label htmlFor="annual-survey-colour">What is your favourite colour?</label>
            <input name="annual-survey-colour" type="range" min={1} max={8} defaultValue={3.5} step={3} />

            <Button onClick={close} isCentered>Submit survey</Button>
         </>
         break;
      }
   }

   return <>
      {content}
   </>;
}

class AnnualSurvey extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />
   }

   close(): void {
      // Play the chord sound
      new CustomAudio("chord.wav");

      super.close(false);
   }
}

export default AnnualSurvey;