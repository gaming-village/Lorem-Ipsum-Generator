import { useCallback, useEffect, useState } from "react";
import Game from "../../Game";
import { Point, roundNum, Vector } from "../../utils";
import Application from "./Application";

interface IncrementText {
   position: Point;
   velocity: Vector;
   elem: HTMLElement;
}

interface ElemProps {
   application: BigLoremCounter;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [localLorem, setLocalLorem] = useState(Game.lorem);
   const [incrementTexts, setIncrementTexts] = useState(new Array<IncrementText>());

   const createIncrementText = useCallback((increase: number) => {
      const elem = application.getElem();

      const incrementText = document.createElement("div");
      incrementText.className = "increment-text";
      incrementText.innerHTML = roundNum(increase);
      elem.appendChild(incrementText);

      const newIncrementTexts = incrementTexts.slice();
      newIncrementTexts.push({
         position: new Point(50, 50),
         velocity: Vector.randomUnit(),
         elem: incrementText
      });
      setIncrementTexts(newIncrementTexts);
   }, [application, incrementTexts]);

   const updateIncrementTexts = useCallback(() => {
      const incrementTextsToRemove = new Array<IncrementText>();
      for (const incrementText of incrementTexts) {
         incrementText.position = incrementText.position.add(incrementText.velocity.convertToPoint());
         incrementText.elem.style.left = incrementText.position.x + "%";
         incrementText.elem.style.top = incrementText.position.y + "%";

         if (incrementText.position.x <= -10 || incrementText.position.x >= 110 || incrementText.position.y <= -10 || incrementText.position.y >= 110) {
            incrementTextsToRemove.push(incrementText);
         }
      }

      // Remove increment texts which are out of bounds
      if (incrementTextsToRemove.length > 0) {
         const newIncrementTexts = incrementTexts.slice();
         while (incrementTextsToRemove.length > 0) {
            const incrementText = incrementTextsToRemove[0];
            newIncrementTexts.splice(newIncrementTexts.indexOf(incrementText));
            incrementTextsToRemove.splice(0, 1);
         }
      }
   }, [incrementTexts]);

   const updateLocalLoremCount = useCallback(() => {
      if (Game.lorem !== localLorem) {
         createIncrementText(Game.lorem - localLorem);
         setLocalLorem(Game.lorem)
      }
   }, [createIncrementText, localLorem]);

   const update = useCallback(() => {
      updateLocalLoremCount();
      updateIncrementTexts();
   }, [updateIncrementTexts, updateLocalLoremCount]);

   useEffect(() => {
      Game.createRenderListener(update);

      return () => {
         Game.removeRenderListener(update);
      }
   }, [update]);

   return <>
      <div className="lorem-container">
         <div className="lorem-count">{roundNum(localLorem)}</div>
      </div>
   </>
}

class BigLoremCounter extends Application {
   protected instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default BigLoremCounter;