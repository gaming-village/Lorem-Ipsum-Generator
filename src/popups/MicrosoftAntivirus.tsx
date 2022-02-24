import Button from "../components/Button";
import Popup from "./Popup";

import WarningIcon from "../images/icons/warning.png";

interface ElemProps {
   closeFunc: () => void;
}
const Elem = ({ closeFunc }: ElemProps) => {
   return <>
      <div className="warning-container">
         <img alt="Warning!" src={WarningIcon} />
         <p>BIG warning!</p>
      </div>

      <p>Microsoft has descovered several of the vulnerbilities inside computer.</p>

      <p>To fix them, you must upgrade your mainframe to System 32</p>

      <Button onClick={closeFunc} isCentered={true}>Go away!</Button>
   </>;
}

class MicrosoftAntivirus extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem closeFunc={this.close} />;
   }
}

export default MicrosoftAntivirus;