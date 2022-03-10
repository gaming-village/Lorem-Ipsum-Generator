import { useCallback, useEffect, useRef, useState } from "react";
import { Point, randFloat, randItem, Vector } from "../../utils";

import WarningImg from "../../images/icons/warning.png";

import Popup, { createRandomPopups } from "./Popup";
import Button from "../../components/Button";
import Game from "../../Game";

interface Confetti {
   position: Point;
   velocity: Vector;
   elem: HTMLElement;
   /** How long the confetti has existed in seconds */
   age: number;
}
const createConfettiElem = (container: HTMLElement): HTMLElement => {
   const confetti = document.createElement("div");
   confetti.className = "confetti"; 
   container.appendChild(confetti);

   confetti.style.transform = "rotate(" + randFloat(0, 360) + "deg)";

   confetti.style.width = randFloat(10, 15) + "px";
   confetti.style.height = randFloat(3.5, 4.75) + "px";

   const COLOURS: ReadonlyArray<string> = ["red", "green", "blue", "yellow"];
   confetti.style.backgroundColor = randItem(COLOURS);

   return confetti;
}

const createConfettis = (container: HTMLElement): Array<Confetti> => {
   const confettis = new Array<Confetti>();
   const count = 30;
   for (let i = 0; i < count; i++) {
      const position = new Point(
         randFloat(0, 100),
         randFloat(0, 100)
      );

      const velocity = new Vector(randFloat(25, 75), randFloat(-1, 1));

      confettis.push({
         position: position,
         velocity: velocity,
         elem: createConfettiElem(container),
         age: 0
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

   const claimReward = useCallback((claimedReward: Reward): void => {
      const rewardIsNumber = typeof claimedReward === "number";
      if (rewardIsNumber) {
         Game.lorem += claimedReward;
      } else {
         switch (claimedReward) {
            case "Popup wave": {
               createRandomPopups(3);
               break;
            }
         }
      }

      if (!(rewardIsNumber && claimedReward < 0)) {
         // Create confetti!
         const elem = popup.getElem();
         const newConfettis = createConfettis(elem);
         setConfettis(newConfettis.slice());
      }
   }, [popup]);

   useEffect(() => {
      if (stage === Stage.Opened) {
         claimReward(reward!);
      }
   }, [claimReward, reward, stage]);
   
   const startRewardRoll = useCallback(() => {
      rollCount.current++;

      setTimeout(() => {
         if (rollCount.current === 25) {
            setStage(Stage.Opened);
         } else {
            const newReward = getRandomReward(reward);
            setReward(newReward);

            startRewardRoll();
         }
      }, Math.pow(rollCount.current, 1.3) * 5);
   }, [reward]);

   const openReward = useCallback(() => {
      setStage(Stage.Opening);
      startRewardRoll();
   }, [startRewardRoll]);

   const updateConfettis = useCallback(() => {
      const confettisToRemove = new Array<Confetti>();
      for (const confetti of confettis) {
         confetti.age += 1 / Game.tps;

         confetti.position = confetti.position.add(confetti.velocity.convertToPoint().multiply(1 / Game.tps));
         confetti.velocity.x *= 0.95;

         const gravity = 1 * Math.pow(confetti.age + 0.75, 2.5);
         confetti.velocity.y -= gravity;

         confetti.elem.style.left = confetti.position.x + "%";
         confetti.elem.style.bottom = confetti.position.y + "%";

         if (confetti.position.x <= -10 || confetti.position.x >= 110 || confetti.position.y <= -10) {
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

      <p style={{textAlign: "center"}}>You are our 1,00,,, visitor!</p>

      <p style={{textAlign: "center"}}>As reward, we give you free thing!</p>

      <div className="rainbow-bg">
         <div className="box">
            {reward !== null ? typeof reward === "number" ? (
               <span style={stage === Stage.Opened && reward < 0 ? { color: "red" } : undefined}>{reward} lorem</span>
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