import { useEffect } from "react";
import Game from "../Game";
import Popup from "./Popup";

interface ElemProps {
   application: Rain;
}
const Elem = ({ application }: ElemProps) => {
   const stealLorem = (): void => {

   }

   useEffect(() => {
      Game.createRenderListener(stealLorem);

      return () => {
         Game.removeRenderListener(stealLorem);
      }
   }, []);

   return <>
      <p>It's raining!</p>
   </>;
}

class Rain extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem application={this} />
   }
   
}

export default Rain;