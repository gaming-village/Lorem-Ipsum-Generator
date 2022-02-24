import { useState } from "react";
import Button from "../components/Button";
import WindowsProgram from "../components/WindowsProgram";
import Popup from "./Popup";

const ERROR_TITLES = ["ERROR", "warning!!1!"]
const ErrorPopup = () => {
   return <WindowsProgram title={ERROR_TITLES[Math.floor(Math.random() * ERROR_TITLES.length)]} uiButtons={["close"]}>
      <p>Incorrect!</p>
   </WindowsProgram>
}

enum ElemState {
   introduction,
   input,
   error
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

   let content!: JSX.Element;
   switch (state) {
      case ElemState.introduction: {
         content = <>
            <p>Dear Chroium user,</p>
            <p>You are todays lucky Visitor! <i>(June)</i></p>
            <p>Please complete this short survey and to say "Thanks You" we would offer the <b>50 dollers!</b></p>

            <Button onClick={incrementState} isCentered={true}>Start survey</Button>
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

            <Button onClick={incrementState} isCentered={true}>Submit survey</Button>
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

}

export default AnnualSurvey;