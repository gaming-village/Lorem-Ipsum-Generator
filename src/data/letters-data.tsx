import React from "react";
import List from "../components/List";
import Game from "../Game";

export interface LetterReward {
   readonly name: string;
   readonly imgSrc: string;
   readonly rewardOnClaim: Function;
   isClaimed: boolean;
}

export interface LetterInfo {
   readonly name: string;
   readonly subject: string;
   readonly from: string;
   readonly body: JSX.Element;
   readonly folder: string;
   readonly reward?: LetterReward;
   readonly isCloseable: boolean;
   isReceived?: boolean;
   isOpened?: boolean;
   hashID?: number;
}

const LETTERS: ReadonlyArray<LetterInfo> = [
   {
      name: "introduction",
      subject: "Corporate Overview",
      from: "Lorem Corp",
      body: <>
         <p>Greetings Worker #[[WORKER_NUMBER]].</p>
         <p>By now you may have noticed the "Corporate Overview" button at the top of your virtual machine. Click it to see an overview of your position here at Lorem Corp, and your workers.</p>
         <p>Of course, being a worthless intern, you have no workers.</p>
         <p>May your lorem generation be filled with suffering.</p>
      </>,
      folder: "inbox",
      isCloseable: false
   },
   {
      name: "freeIPhone",
      subject: "Steven Job - free An-Droid",
      from: "Apple Company",
      body: <>
         <p>Greeting customer</p>
         <p>Becuse of you are 1,00,000th viewer, Steve Job give you free iphone $1 now</p>
         <p>Pls sned bank acount details to james.willson@yahoo.com and arabian prince will give you 2$ of .</p>
         <p>Of kind Regard ,</p>
         <p>queen of England</p>
      </>,
      folder: "junkMail",
      isCloseable: false
   },
   {
      name: "loremTips",
      subject: "Tips with Lorem Corp",
      from: "Lorem Corp",
      body: <>
         <p>Greetings interns.</p>
         <p>To assist you in your time at Lorem Corp, our design team has envisioned a series of tips to help you in your lorem generation:</p>
         <List>
            <>
               <li>To maximize efficiency, reduce the amount of time spent sleeping and resting as that does not produce lorem.</li>
               <li>Overtime shifts are one of the best ways to get ahead of your peers.</li>
               <li>Unnecessary distractions such as 'friends' and 'family' may inhibit your ability to produce lorem. Consider removing them.</li>
            </>
         </List>
      </>,
      folder: "inbox",
      isCloseable: false
   },
   {
      name: "motivationalLetter",
      subject: "Motivational Letter",
      from: "Lorem Corp",
      body: <>
         <p>Greetings employees.</p>
         <p>The Motivational Department of Lorem Corp would like to send a reminder that any suspicious activity will result in your immediate termination.</p>
         <p>We have also implemented a Lorem Quota. Those who meet the quota shall be rewarded.</p>
      </>,
      folder: "inbox",
      isCloseable: false,
      // reward: {
      //    name: "Lorem Quota",
      //    imgSrc: "images/coin-icon.png",
      //    reward: () => {
      //       console.log("Unlocked the lorem quota");
      //       // Game.loremQuota.unlock();
      //       // updateMiscCookie();
      //    },
      //    isClaimed: false
      // }
   },
   {
      name: "rumors",
      subject: "Addressing Rumors",
      from: "Lorem Corp",
      body: <>
         <p>Greetings employees.</p>
         <p>It has come to our attention that there are several fallacious claims of 'malware-infected' computers. Disregard them - our system is perfect and flawless.</p>
      </>,
      folder: "inbox",
      isCloseable: false
   },
   {
      name: "bomb",
      subject: "urgent Matters",
      from: "police",
      body: <>
         <p>quick! they're is the Bomb and he will explode if you dont send severaly money to me buy tomorrow.</p>
         <img style={{ width: "5rem", marginLeft: "50%", transform: "translateX(-50%)" }} src={require("../images/regular/bomb.jpeg").default} alt="" />
         <p>figure 1.0: bomb</p>
      </>,
      folder: "junkMail",
      isCloseable: true
   },
   {
      name: "test",
      subject: "Test",
      from: "obama",
      body: <>
         <p>Greetings from Australia.</p>
         <p>I am gaming rn</p>
      </>,
      folder: "inbox",
      isCloseable: false
   },
   {
      name: "aaaaa",
      subject: "aaaa",
      from: "test2",
      body: <>
         <p>test1</p>
         <p>test2</p>
         <p>test3 TEST3</p>
      </>,
      folder: "inbox",
      isCloseable: true,
      reward: {
         name: "10 Lorem",
         imgSrc: "icons/scroll.png",
         rewardOnClaim: () => {
            Game.lorem = 0;
         },
         isClaimed: false
      }
   },
   {
      name: "long",
      subject: "looooong boi",
      from: "tall chad",
      body: <>
         <p>HEAD</p>
         <p>neck</p>
         <p>neck</p>
         <p>body</p>
         <p>body</p>
         <p>body</p>
         <p>body</p>
         <p>feet</p>
      </>,
      folder: "junkMail",
      isCloseable: true
   },
   {
      name: "reeee",
      subject: "This is a very long subject yes",
      from: "longlad",
      body: <>
         <p>HEAD</p>
         <p>neck</p>
         <p>neck</p>
         <p>body</p>
         <p>body</p>
         <p>body</p>
         <p>body</p>
         <p>feet</p>
      </>,
      folder: "deletedItems",
      isCloseable: true
   }
];

export default LETTERS;