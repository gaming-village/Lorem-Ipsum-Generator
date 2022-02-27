import List from "../components/List";

export interface LetterReward {
   readonly name: string;
   readonly imgSrc: string;
   readonly claimFunc: () => void;
   isClaimed: boolean;
}

export interface LetterInfo {
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
      subject: "Corporate Overview",
      from: "Lorem Corp",
      body: <>
         <p>Greetings Worker.</p>
         <p>By now you may have noticed the "Corporate Overview" button at the top of your virtual machine. Click it to see an overview of your position here at Lorem Corp, and your workers.</p>
         <p>Of course, being a worthless intern, you have no workers.</p>
         <p>May your lorem generation be filled with suffering.</p>
      </>,
      folder: "Inbox",
      isCloseable: false
   },
   {
      subject: "Steven Job - free An-Droid",
      from: "Apple Company",
      body: <>
         <p>Greeting customer</p>
         <p>You are 1,00,000.0,0 viewer. Steve give you iphone $1. yes?</p>
         <p>plz sned bank acount details to james.willson@yahoo.com and arabian prince will give you 2$ of .</p>
         <p>Regard of kind,</p>
         <p>an queen Of England</p>
      </>,
      folder: "Junk Mail",
      isCloseable: false
   },
   {
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
      folder: "Inbox",
      isCloseable: false
   },
   {
      subject: "Motivational Letter",
      from: "Lorem Corp",
      body: <>
         <p>Greetings employees.</p>
         <p>The Motivational Department of Lorem Corp would like to send a reminder that any suspicious activity will result in your immediate termination.</p>
         <p>We have also implemented a Lorem Quota. Those who meet the quota shall be rewarded.</p>
      </>,
      folder: "Inbox",
      isCloseable: false
   },
   {
      subject: "Addressing Rumors",
      from: "Lorem Corp",
      body: <>
         <p>Greetings employees.</p>
         <p>It has come to our attention that there are several fallacious claims of 'malware-infected' computers. Disregard them - our system is perfect and flawless.</p>
      </>,
      folder: "Inbox",
      isCloseable: false
   },
   {
      subject: "Invitation",
      from: "0b4m4",
      body: <>
         <p>...</p>
      </>,
      folder: "Inbox",
      reward: {
         name: "Black Market",
         imgSrc: "",
         claimFunc: () => {
            
         },
         isClaimed: false
      },
      isCloseable: false
   },
   {
      subject: "urgent Matters",
      from: "police",
      body: <>
         <p>quick! they're is the Bomb and he will explode if you dont send severaly money to me buy tomorrow.</p>
         <img style={{ width: "5rem", marginLeft: "50%", transform: "translateX(-50%)" }} src={require("../images/regular/bomb.jpeg").default} alt="" />
         <p>figure 1.0: bomb</p>
      </>,
      folder: "Junk Mail",
      isCloseable: true
   },
   {
      subject: "Social security issue !",
      from: "invalid.ASS.card@scamco.company.co",
      body: <>
         <p>Hello citezen,</p>
         <p>your American Social Security (A.S.S) has expired and we will steal your lungs in 2-3 busines days.</p>
         <p>To avoid this stealing, please give us your money.</p>
         <p>I am apoligized for your inconvenience,,</p>
      </>,
      folder: "Junk Mail",
      isCloseable: true
   },
   {
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
      folder: "Junk Mail",
      isCloseable: true
   },
   {
      subject: "Government is here",
      from: "The Government",
      body: <>
         <p>Your fedral tax agreement <b>ID #1923829</b> has not been accepted.</p>
         <p>If you don't not pay taxes, the IRS will eliminate you with Big gun.</p>
         <p>Pelase cotnact this page if you are in a confusion.</p>
      </>,
      folder: "Junk Mail",
      isCloseable: true
   }
];

export default LETTERS;