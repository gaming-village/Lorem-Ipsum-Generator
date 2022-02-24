import Button from "../components/Button";
import Popup from "./Popup";

import WarningIcon from "../images/icons/warning.png";
import Game from "../Game";

interface ElemProps {
   popup: MicrosoftAntivirus;
}
const Elem = ({ popup }: ElemProps) => {
   return <>
      <div className="warning-container">
         <img alt="Warning!" src={WarningIcon} />
         <p>BIG warning!</p>
      </div>

      <p>Microsoft has descovered several of the vulnerbilities inside computer.</p>

      <p>To fix them, you must upgrade your mainframe to System 32</p>

      <Button onClick={() => popup.close()} isCentered={true}>Go away!</Button>
   </>;
}

class MicrosoftAntivirus extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />;
   }

   close(): void {
      super.close();

      Game.lorem += 3;
   }
}

export default MicrosoftAntivirus;