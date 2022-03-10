import { useCallback, useEffect, useRef, useState } from "react";
import { Point, randFloat, randInt, randItem, Vector } from "../../utils";

import WarningImg from "../../images/icons/warning.png";

import Popup from "./Popup";
import Button from "../../components/Button";
import Game from "../../Game";

interface Confetti {
   position: Point;
   velocity: Vector;
   elem: HTMLElement;
}
const createConfettiElem = (container: HTMLElement): HTMLElement => {
   const confetti = document.createElement("div");
   confetti.className = "confetti"; 
   container.appendChild(confetti);

   confetti.style.width = randFloat(10, 12.5) + "px";
   confetti.style.height = randFloat(4.5, 4.75) + "px";

   const COLOURS: ReadonlyArray<string> = ["red", "green", "blue", "yellow"];
   confetti.style.backgroundColor = randItem(COLOURS);

   return confetti;
}

const createConfettis = (container: HTMLElement): Array<Confetti> => {
   console.log("start create");
   const confettis = new Array<Confetti>();
   const count = randInt(10, 20);
   for (let i = 0; i < count; i++) {
      const position = new Point(
         randFloat(0, 100),
         randFloat(0, 100)
      );

      const velocity = new Vector(randFloat(25, 50), randFloat(-1, 1));

      confettis.push({
         position: position,
         velocity: velocity,
         elem: createConfettiElem(container)
      });
   }
   return confettis;
}

type Reward = string | number;

const REWARD_DATA: ReadonlyArray<Reward> = [
   1,
   3,
   7,
   15,
   -1,
   -5,
   "Popup wave"
];

const getRandomReward = (previousReward: Reward | null): Reward => {
   const potentialRewards = REWARD_DATA.slice();
   if (previousReward !== null) {
      potentialRewards.splice(potentialRewards.indexOf(previousReward));
   }

   const reward = randItem(potentialRewards);
   return reward;
}

enum Stage {
   Waiting,
   Opening,
   Opened
}

interface ElemProps {
   popup: Visitor;
}
const Elem = ({ popup }: ElemProps): JSX.Element => {
   const [time, setTime] = useState(0);
   const [reward, setReward] = useState<Reward | null>(null);
   const [stage, setStage] = useState<Stage>(Stage.Waiting);
   const [confettis, setConfettis] = useState<Array<Confetti>>(new Array<Confetti>());

   const rollCount = useRef<number>(0);

   const claimReward = (): void => {
      setStage(Stage.Opened);

      const elem = popup.getElem();
      const newConfettis = createConfettis(elem);
      setConfettis(newConfettis.slice());
   }

   const startRewardRoll = (): void => {
      rollCount.current++;

      setTimeout(() => {
         if (rollCount.current === 25) {
            claimReward();
         } else {
            const newReward = getRandomReward(reward);
            setReward(newReward);

            startRewardRoll();
         }
      }, Math.pow(rollCount.current, 1.3) * 5);
   }

   const openReward = (): void => {
      setStage(Stage.Opening);
      startRewardRoll();
   }

   const updateConfettis = useCallback(() => {
      const confettisToRemove = new Array<Confetti>();
      for (const confetti of confettis) {
         confetti.position = confetti.position.add(confetti.velocity.convertToPoint().multiply(1 / Game.tps));
         confetti.velocity.x *= 0.95;
         confetti.velocity.y -= 1;
         if (confetti.velocity.y <= 10 && confetti.velocity.y >= 0) {
            confetti.velocity.y *= 0.9;
         }
         if (confetti.velocity.y < 0) {
            confetti.velocity.y *= 1.05;
         }

         confetti.elem.style.left = confetti.position.x + "%";
         confetti.elem.style.bottom = confetti.position.y + "%";

         if (confetti.position.x <= -10 || confetti.position.x >= 110 || confetti.position.y <= -10 || confetti.position.y >= 110) {
            confettisToRemove.push(confetti);
         }
      }

      // Remove increment texts which are out of bounds
      if (confettisToRemove.length > 0) {
         const newConfettis = confettis.slice();
         while (confettisToRemove.length > 0) {
            const confetti = confettisToRemove[0];
            confetti.elem.remove();

            newConfettis.splice(newConfettis.indexOf(confetti), 1);
            confettisToRemove.splice(0, 1);
         }
         setConfettis(newConfettis);
      }
   }, [confettis]);

   const update = useCallback(() => {
      if (stage === Stage.Opening) {
         const newTime = time + 1 / Game.tps;
         setTime(newTime);
      }

      if (stage > 0) {
         updateConfettis();
      }
   }, [stage, time, updateConfettis]);

   useEffect(() => {
      Game.createRenderListener(update);

      return () => {
         Game.removeRenderListener(update);
      }
   }, [update]);

   return <>
      <div className="warning-container">
         <img src={WarningImg} alt="Warning!" />
         <p>Congratulations</p>
      </div>

      <p>You are our 1,00,,, visitor!</p>

      <p>As reward, we give you free thing!</p>

      <div className="rainbow-bg">
         <div className="box">
            {reward !== null ? typeof reward === "number" ? (
               <span>{reward} lorem</span>
            ) : (
               <span>{reward}</span>
            ) : (
               <span>???</span>
            )}
         </div>
      </div>

      <Button onClick={stage === Stage.Waiting ? openReward : undefined} isCentered isDark={stage !== Stage.Waiting}>
         {stage === Stage.Waiting ? "Open" : stage === Stage.Opening ? `Spinning..${time % 1 < 0.5 ? "." : ""}` : (
            typeof reward! === "number" ? (reward > 0 ? "Yay!" : "Aww...") : "Special!"
         )}
      </Button>
   </>;
}

class Visitor extends Popup {
   protected instantiate(): JSX.Element {
      return <Elem popup={this} />
   }

}

export default Visitor;