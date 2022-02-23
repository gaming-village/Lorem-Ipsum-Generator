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
}

interface LoremLetter {
   name: string;
   requirement: number;
}

export const LOREM_LETTERS: ReadonlyArray<LoremLetter> = [
   {
      name: "Tips with Lorem Corp",
      requirement: 5
   },
   {
      name: "Corporate Overview",
      requirement: 10
   },
   {
      name: "Steven Job - free An-Droid",
      requirement: 15
   },
   {
      name: "Addressing Rumors",
      requirement: 30
   },
   {
      name: "urgent Matters",
      requirement: 75
   },
   {
      name: "Social security issue !",
      requirement: 200
   },
   {
      name: "Order delivery",
      requirement: 1000
   },
   {
      name: "Government is here",
      requirement: 3000
   }
];

const LETTERS: ReadonlyArray<LetterInfo> = [
   {
      name: "introduction",
      subject: "Corporate Overview",
      from: "Lorem Corp",
      body: <>
         <p>Greetings Worker.</p>
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
         <p>You are 1,00,000.0,0 viewer. Steve give you iphone $1. yes?</p>
         <p>plz sned bank acount details to james.willson@yahoo.com and arabian prince will give you 2$ of .</p>
         <p>Regard of kind,</p>
         <p>an queen Of England</p>
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
   },
   {
      name: "socil",
      subject: "Social security issue !",
      from: "invalid.ASS.card@scamco.company.co",
      body: <>
         <p>Hello citezen,</p>
         <p>your American Social Security (A.S.S) has expired and we will steal your lungs in 2-3 busines days.</p>
         <p>To avoid this stealing, please give us your money.</p>
         <p>I am apoligized for your inconvenience,,</p>
      </>,
      folder: "junkMail",
      isCloseable: true
   },
   {
      name: "aaa",
      subject: "Order delivery",
      from: "amzon.shipping@gmail.com",
      body: <>
         <p>Hello,</p>
         <p>Amazon company has received 2 packages for you.</p>
         <p><b>Order #25824823</b></p>
         <p><b>Shipping method:</b> Death drones</p>
         <p><b>Shipping preferences:</b> Throw my items at my door</p>
         <p>If you believe that this order is an error, please give me your money.</p>
      </>,
      folder: "junkMail",
      isCloseable: true
   },
   {
      name: "aab",
      subject: "Government is here",
      from: "The Government",
      body: <>
         <p>Your fedral tax agreement <b>ID #1923829</b> has not been accepted.</p>
         <p>If you don't not pay taxes, the IRS will eliminate you with Big gun.</p>
         <p>Pelase cotnact this page if you are in a confusion.</p>
      </>,
      folder: "junkMail",
      isCloseable: true
   }
];

export default LETTERS;