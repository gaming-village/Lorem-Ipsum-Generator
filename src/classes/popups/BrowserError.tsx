import Popup from "./Popup";

import BombImg from "../../images/miscellaneous/bomb.png";
import Button from "../../components/Button";
import Game from "../../Game";
import { PopupInfo } from "../../data/popup-data";

interface ElemProps {
   application: BrowserError;
}
const Elem = ({ application }: ElemProps) => {
   return <>
      <img className="bomb" src={BombImg} alt="bomb!11!!!1" />

      <p>Your browser has occured! In order to prevent this, you are Downloading this viruse!</p>

      <Button onClick={() => application.close()} isCentered>no</Button>
   </>;
}

class BrowserError extends Popup {
   constructor(info: PopupInfo) {
      super(info);

      this.createMoveTimer();
   }

   protected instantiate(): JSX.Element {
      return <Elem application={this} />;
   }

   close(): void {
      super.close();

      Game.lorem += this.info.elem.loremReward!;
   }

   private createMoveTimer(): void {
      setTimeout(() => {
         if (this.getElem() === null) return;

         if (this.move !== null) this.move();
         this.createMoveTimer();
      }, 1500);
   }
}

export default BrowserError;