import WindowsProgram from "../components/WindowsProgram";
import { PopupInfo } from "../data/popup-data";

interface PopupElemInfo {
   info: PopupInfo;
   keyNum: number;
   application: Popup;
   children: JSX.Element;
}
const PopupElem = ({ info, keyNum, application, children }: PopupElemInfo) => {
   let iconSrc!: string;
   try {
      iconSrc = require("../images/popup-icons/" + info.iconSrc).default;
   } catch {
      iconSrc = require("../images/icons/questionmark.png").default;
   }

   return <WindowsProgram className="popup" key={keyNum} title={info.name} titleIconSrc={iconSrc}>
      {children}
   </WindowsProgram>;
}

abstract class Popup {
   private info: PopupInfo;

   constructor(info: PopupInfo) {
      this.info = info;


   }

   createElem(keyNum: number): JSX.Element {
      const elemContent = this.instantiate();

      return <PopupElem key={keyNum} info={this.info} keyNum={keyNum} application={this}>
         {elemContent}
      </PopupElem>;
   }

   protected abstract instantiate(): JSX.Element;

   close(): void {

   }
}

export default Popup;