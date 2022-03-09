export interface PopupInfo {
   readonly name: string;
   readonly description?: string;
   readonly flavourText?: string;
   readonly cost: number;
   readonly iconSrc: string;
   readonly className: string;
   /** The item's position on the screen */
   readonly displayPos: {
      readonly top: number;
      readonly left: number;
   },
   /** Affects properties of instances of the popup */
   readonly elem: {
   /** The actual popup's dimensions (optional) */
   readonly dimensions?: {
         readonly width?: string;
         readonly height?: string;
      }
      /** The popup's titlebar text */
      readonly title: string;
      /** If true, there can only be one of the popup visible at a time */
      readonly isSingleElem: boolean;
   }
   isUnlocked?: boolean;
   readonly isChunkyPopup?: boolean;
   readonly children: Array<string>;
}
const POPUP_DATA: ReadonlyArray<PopupInfo> = [
   {
      name: "microsoft-antivirus",
      flavourText: "An omen of what to come.",
      cost: 0.5,
      iconSrc: "microsoft-antivirus.png",
      className: "MicrosoftAntivirus",
      displayPos: {
         top: 0,
         left: 0
      },
      elem: {
         dimensions: {
            width: "20rem"
         },
         title: "Macrosoft Antibus",
         isSingleElem: false
      },
      children: []
   },
   {
      name: "browser-error",
      description: "Moves around the screen randomly.",
      flavourText: "Mostly just made to annoy you.",
      cost: 2.5,
      iconSrc: "",
      className: "BrowserError",
      displayPos: {
         top: 7,
         left: 10
      },
      elem: {
         dimensions: {
            width: "15rem"
         },
         title: "Error",
         isSingleElem: false
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "rain",
      description: "Leeches 1 lorem every second. When closed, gives back 1.5x what was stolen.",
      flavourText: "Designed just in case users don't know their browser has occurred.",
      cost: 5,
      iconSrc: "",
      className: "Rain",
      displayPos: {
         top: -5.5,
         left: -10
      },
      elem: {
         title: "Rain",
         isSingleElem: true
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "chunky",
      description: 'Becomes enraged when closed too many times - appeasement is required.',
      flavourText: "The Lord, precursor of His peoples.",
      cost: 20,
      iconSrc: "chunky.png",
      className: "",
      displayPos: {
         top: -18,
         left: -4
      },
      elem: {
         title: "Chunky",
         isSingleElem: true
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "clippy",
      description: "Removes several popups when it appears.",
      flavourText: "Culls the popup population.",
      cost: 20,
      iconSrc: "clippy.png",
      className: "",
      displayPos: {
         top: -12,
         left: 7.5
      },
      elem: {
         title: "Clippy",
         isSingleElem: true
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "annual-survey",
      description: "Creates 4-8 error popups when submitted.",
      flavourText: "The survey is cold. Unfeeling. It does not care for your input. It cares only for hard, efficient autonomy.",
      cost: 20,
      iconSrc: "",
      className: "AnnualSurvey",
      displayPos: {
         top: 10,
         left: -7
      },
      elem: {
         dimensions: {
            width: "20rem"
         },
         title: "2018 Annual Survey",
         isSingleElem: false
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "free-iPhone",
      description: "Tries to evade being clicked.",
      flavourText: "I wonder how effective these popups actually are...",
      cost: 7.5,
      iconSrc: "",
      className: "",
      displayPos: {
         top: 17,
         left: 4
      },
      elem: {
         title: "Free an-Droid",
         isSingleElem: false
      },
      children: ["browser-error"]
   },
   {
      name: "adblock-blocker",
      flavourText: "Blocks adblockers which block ads.",
      description: "",
      cost: 40,
      iconSrc: "",
      className: "",
      displayPos: {
         top: 9,
         left: -16
      },
      elem: {
         title: "Adblock blocker",
         isSingleElem: false
      },
      children: ["annual-survey"]
   },
   {
      name: "lurem-impsir",
      flavourText: "Progress demands sacrifice.",
      description: "Stops production of lorem ipsum until closed.",
      cost: 25,
      iconSrc: "",
      className: "LuremImpsir",
      displayPos: {
         top: -1.5,
         left: -17.5
      },
      elem: {
         dimensions: {
            width: "20rem"
         },
         title: "Lurem Ipmsir",
         isSingleElem: false
      },
      children: ["rain"]
   },
   {
      name: "chunky-virus",
      description: "Duplicates itself when closed, automatically closes within a time limit when not closed.",
      flavourText: "Chunky grows angry.",
      cost: 5,
      iconSrc: "",
      className: "",
      displayPos: {
         top: -27,
         left: -8
      },
      elem: {
         title: "Chunky virus",
         isSingleElem: false
      },
      children: ["chunky"],
      isChunkyPopup: true
   },
   {
      name: "visitor",
      description: "Gives a random reward each appearance.",
      cost: 12,
      iconSrc: "",
      className: "",
      displayPos: {
         top: -18,
         left: -13
      },
      elem: {
         title: "1,0000,000nd Visited!",
         isSingleElem: false
      },
      children: ["rain"]
   },
   {
      name: "chunky-plantation",
      description: "Generates 10-20 bananas which explode into points.",
      flavourText: "Chunky's banana plantation.",
      cost: 75,
      iconSrc: "",
      className: "",
      displayPos: {
            top: -29,
            left: -0.5
      },
      elem: {
         title: "Banana Overload",
         isSingleElem: false
      },
      children: ["chunky"],
      isChunkyPopup: true
   },
   {
      name: "ram-download",
      description: "Takes several seconds to process. Gives lorem once complete.",
      flavourText: "The first implementation of digital RAM download. Viruses not sold seperately.",
      cost: 35,
      iconSrc: "",
      className: "",
      displayPos: {
         top: -12,
         left: -18.5
      },
      elem: {
         title: "Free R.A.M Download",
         isSingleElem: false
      },
      children: ["rain"]
   },
   {
      name: "bank-details",
      description: "Requires precise input to close.",
      flavourText: "Your password is not strong enough.",
      cost: 60,
      iconSrc: "",
      className: "BankDetails",
      displayPos: {
         top: 23,
         left: -4.5
      },
      elem: {
         dimensions: {
            width: "25rem"
         },
         title: "Amason.com",
         isSingleElem: false
      },
      children: ["annual-survey"]
   },
   {
      name: "expandinator",
      flavourText: "Expande.",
      description: "Expands to fill the screen if not clicked fast enough.",
      cost: 35,
      iconSrc: "",
      className: "",
      displayPos: {
            top: 20,
            left: 15
      },
      elem: {
         title: "The Expandinator",
         isSingleElem: false
      },
      children: ["browser-error"]
   },
   {
      name: "dev-hire",
      flavourText: "Made as a practical joke by the Devil to ruin the days of aspiring web developers.",
      description: "Shows multiple prompts when you try to close it.",
      cost: 175,
      iconSrc: "",
      className: "",
      displayPos: {
         top: 20,
         left: -11.5
      },
      elem: {
         title: "monkecodecamp.gov.org.edu.au",
         isSingleElem: false
      },
      children: ["annual-survey"]
   }
];

export default POPUP_DATA;