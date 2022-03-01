import { useCallback, useEffect, useRef, useState } from "react";

// Praise be the sun
import TheSun from "../../images/miscellaneous/sun.png";

import Button from "../../components/Button";
import Program from "./Program";

import Game from "../../Game";
import { LOREM_PRECEPTS, PreceptInfo } from "../../data/church-of-lorem-data";
import { randItem } from "../../utils";

const Elem = () => {
   // Determines the current elevation and rotation of the sun (0-3)
   // Elevation oscillates 0-3 wait1 3-0 wait1 repeat, rotation constantly changing
   const [sunTicks, setSunTicks] = useState<number>(0);
   const [precept, setPrecept] = useState<PreceptInfo | null>(null);
   const sunRef = useRef<HTMLImageElement>(null);

   const generatePrecept = (): void => {
      const potentialPrecepts = LOREM_PRECEPTS.slice();

      const idx = precept !== null ? potentialPrecepts.indexOf(precept) : -1
      if (idx !== -1) {
         potentialPrecepts.splice(idx, 1);
      }

      setPrecept(randItem(potentialPrecepts));
   }

   const updateSun = useCallback(() => {
      /** Phase of the sun from 0-7 */
      const sunPhase = sunTicks % 8;

      /** Elevation of the sun from 0-3 */
      let elevation!: number;
      if (sunPhase < 4) {
         elevation = Math.min(sunPhase + 1, 3);
      } else {
         elevation = Math.max(6 - sunPhase, 0);
      }
      
      /** Rotation state of the sun from 0-8 */
      const rotation = sunPhase;
      
      sunRef.current!.style.setProperty("--elevation", elevation * 10 + "px");
      sunRef.current!.style.setProperty("--rotation", (rotation + 1) * 45 + "deg");
   }, [sunTicks]);
   
   // Time it takes to tick in seconds
   const TICK_RATE = 2;
   const incrementTicks = useCallback(() => {
      if (Game.ticks % Game.tps * TICK_RATE === 0) {
         setSunTicks(sunTicks + 1);
         updateSun();
      }
   }, [sunTicks, updateSun]);

   useEffect(() => {
      Game.createRenderListener(incrementTicks);

      return () => {
         Game.removeRenderListener(incrementTicks);
      }
   }, [incrementTicks]);

   return <>
      <div className="control-panel">
         <Button onClick={generatePrecept}>Invoke Precept</Button>
      </div>

      <img ref={sunRef} src={TheSun} alt="The Sun" id="sun" />

      <div id="precept-area">
         {precept !== null ? <>
            <h3>{precept.name}</h3>
            <p>{precept.content}</p>

            <span className="precept-num">PRECEPT {LOREM_PRECEPTS.indexOf(precept) + 1}</span>
         </> : (
            <p className="message">(No precept invoked)</p>
         )}
      </div>
   </>;
}

class Oracle extends Program {
   constructor() {
      super({
         name: "The Oracle",
         id: "oracle",
         fileName: "the_oracle",
         isChurchProgram: true
      });
   }

   protected instantiate(): JSX.Element {
      return <Elem />;
   }
}

export default Oracle;