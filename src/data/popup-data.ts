export interface PopupInfo {
   readonly name: string;
   readonly className: string;
   readonly description?: string;
   readonly flavourText?: string;
   readonly cost: number;
   readonly iconSrc: string;
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
      readonly loremReward?: number;
   }
   isUnlocked?: boolean;
   readonly isChunkyPopup?: boolean;
   readonly children: Array<string>;
   /** The popup's unique identifier. Doesn't need to be in any pattern or order, just needs to be unique for every popup */
   readonly id: number;
}
const POPUP_DATA: ReadonlyArray<PopupInfo> = [
   {
      name: "microsoft-antivirus",
      className: "MicrosoftAntivirus",
      flavourText: "An omen of what to come.",
      cost: 0.5,
      iconSrc: "microsoft-antivirus.png",
      displayPos: {
         top: 0,
         left: 0
      },
      elem: {
         dimensions: {
            width: "20rem"
         },
         title: "Macrosoft Antibus",
         isSingleElem: false,
         loremReward: 5
      },
      children: [],
      id: 1
   },
   {
      name: "browser-error",
      className: "BrowserError",
      description: "Moves around the screen randomly.",
      flavourText: "Mostly just made to annoy you.",
      cost: 2.5,
      iconSrc: "",
      displayPos: {
         top: 7,
         left: 10
      },
      elem: {
         dimensions: {
            width: "15rem"
         },
         title: "Error",
         isSingleElem: false,
         loremReward: 7
      },
      children: ["microsoft-antivirus"],
      id: 2
   },
   {
      name: "rain",
      className: "Rain",
      description: "Leeches 1 lorem every second. When closed, gives back 1.5x what was stolen.",
      flavourText: "Designed just in case users don't know their browser has occurred.",
      cost: 5,
      iconSrc: "",
      displayPos: {
         top: -5.5,
         left: -10
      },
      elem: {
         title: "Rain",
         isSingleElem: true
      },
      children: ["microsoft-antivirus"],
      id: 3
   },
   {
      name: "chunky",
      className: "Chunky",
      description: 'Becomes enraged when closed too many times - appeasement is required.',
      flavourText: "The Lord, precursor of His peoples.",
      cost: 20,
      iconSrc: "chunky.png",
      displayPos: {
         top: -18,
         left: -4
      },
      elem: {
         title: "Chunky",
         isSingleElem: true
      },
      children: ["microsoft-antivirus"],
      id: 4
   },
   {
      name: "clippy",
      className: "",
      description: "Removes several popups when it appears.",
      flavourText: "Culls the popup population.",
      cost: 20,
      iconSrc: "clippy.png",
      displayPos: {
         top: -12,
         left: 7.5
      },
      elem: {
         title: "Clippy",
         isSingleElem: true
      },
      children: ["microsoft-antivirus"],
      id: 5
   },
   {
      name: "annual-survey",
      className: "AnnualSurvey",
      description: "Creates 4-8 error popups when submitted.",
      flavourText: "The survey is cold. Unfeeling. It does not care for your input. It cares only for hard, efficient autonomy.",
      cost: 20,
      iconSrc: "",
      displayPos: {
         top: 10,
         left: -7
      },
      elem: {
         dimensions: {
            width: "20rem"
         },
         title: "2018 Annual Survey",
         isSingleElem: false,
         loremReward: 15
      },
      children: ["microsoft-antivirus"],
      id: 6
   },
   {
      name: "free-iPhone",
      className: "",
      description: "Tries to evade being clicked.",
      flavourText: "I wonder how effective these popups actually are...",
      cost: 7.5,
      iconSrc: "",
      displayPos: {
         top: 17,
         left: 4
      },
      elem: {
         title: "Free an-Droid",
         isSingleElem: false,
         loremReward: 20
      },
      children: ["browser-error"],
      id: 7
   },
   {
      name: "adblock-blocker",
      className: "",
      flavourText: "Blocks adblockers which block ads.",
      description: "",
      cost: 40,
      iconSrc: "",
      displayPos: {
         top: 9,
         left: -16
      },
      elem: {
         title: "Adblock blocker",
         isSingleElem: false,
         loremReward: 25
      },
      children: ["annual-survey"],
      id: 8
   },
   {
      name: "lurem-impsir",
      className: "LuremImpsir",
      flavourText: "Progress demands sacrifice.",
      description: "Stops production of lorem ipsum until closed.",
      cost: 25,
      iconSrc: "",
      displayPos: {
         top: -1.5,
         left: -17.5
      },
      elem: {
         dimensions: {
            width: "20rem"
         },
         title: "Lurem Ipmsir",
         isSingleElem: false,
         loremReward: 15
      },
      children: ["rain"],
      id: 9
   },
   {
      name: "chunky-virus",
      className: "",
      description: "Duplicates itself when closed, automatically closes within a time limit when not closed.",
      flavourText: "Chunky grows angry.",
      cost: 5,
      iconSrc: "",
      displayPos: {
         top: -27,
         left: -8
      },
      elem: {
         title: "Chunky virus",
         isSingleElem: false
      },
      children: ["chunky"],
      isChunkyPopup: true,
      id: 10
   },
   {
      name: "visitor",
      className: "Visitor",
      description: "Gives a random reward each appearance.",
      cost: 12,
      iconSrc: "",
      displayPos: {
         top: -18,
         left: -13
      },
      elem: {
         title: "1,0000,000nd Visited!",
         isSingleElem: false,
         loremReward: 25
      },
      children: ["rain"],
      id: 11
   },
   {
      name: "chunky-plantation",
      className: "ChunkyPlantation",
      description: "Generates 10-20 bananas which explode into points.",
      flavourText: "Chunky's banana plantation.",
      cost: 75,
      iconSrc: "",
      displayPos: {
         top: -29,
         left: -0.5
      },
      elem: {
         title: "Banana Overload",
         isSingleElem: false
      },
      children: ["chunky"],
      isChunkyPopup: true,
      id: 12
   },
   {
      name: "ram-download",
      className: "RAMDownload",
      description: "Takes several seconds to process. Gives lorem once complete.",
      flavourText: "The first implementation of digital RAM download. Viruses not sold seperately.",
      cost: 35,
      iconSrc: "",
      displayPos: {
         top: -12,
         left: -18.5
      },
      elem: {
         dimensions: {
            width: "15rem"
         },
         title: "Free R.A.M Download",
         isSingleElem: false,
         loremReward: 30
      },
      children: ["rain"],
      id: 13
   },
   {
      name: "bank-details",
      className: "BankDetails",
      description: "Requires precise input to close.",
      flavourText: "Your password is not strong enough.",
      cost: 60,
      iconSrc: "",
      displayPos: {
         top: 23,
         left: -4.5
      },
      elem: {
         dimensions: {
            width: "25rem"
         },
         title: "Amason.com",
         isSingleElem: false,
         loremReward: 35
      },
      children: ["annual-survey"],
      id: 14
   },
   {
      name: "expandinator",
      className: "Expandinator",
      flavourText: "Expande.",
      description: "Expands to fill the screen if not clicked fast enough.",
      cost: 35,
      iconSrc: "",
      displayPos: {
         top: 20,
         left: 15
      },
      elem: {
         title: "The Expandinator",
         isSingleElem: false,
         loremReward: 20
      },
      children: ["browser-error"],
      id: 15
   },
   {
      name: "dev-hire",
      className: "DevHire",
      flavourText: "Made as a practical joke by the Devil to ruin the days of aspiring web developers.",
      description: "Shows multiple prompts when you try to close it.",
      cost: 175,
      iconSrc: "",
      displayPos: {
         top: 20,
         left: -11.5
      },
      elem: {
         title: "monkecodecamp.gov.org.edu.au",
         isSingleElem: false,
         loremReward: 50
      },
      children: ["annual-survey"],
      id: 16
   }
];

export default POPUP_DATA;