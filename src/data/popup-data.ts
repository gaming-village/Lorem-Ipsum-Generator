export interface PopupInfo {
   readonly name: string;
   readonly description?: string;
   readonly flavourText: string;
   readonly cost: number;
   readonly iconSrc: string;
   /** The item's position on the screen */
   displayPos: {
      top: number;
      left: number;
   },
   isUnlocked?: boolean;
   children: Array<string>;
}
const POPUP_DATA: ReadonlyArray<PopupInfo> = [
   {
      name: "microsoft-antivirus",
      flavourText: "An omen of what to come.",
      cost: 0.5,
      iconSrc: "",
      displayPos: {
         top: 0,
         left: 0
      },
      children: []
   },
   {
      name: "browser-error",
      description: "Moves around the screen randomly.",
      flavourText: "Mostly just made to annoy you.",
      cost: 2.5,
      iconSrc: "",
      displayPos: {
         top: 7,
         left: 10
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "rain",
      description: "Leeches 1 lorem every second. When closed, gives back 1.5x what was stolen.",
      flavourText: "Designed just in case users don't know their browser has occurred.",
      cost: 5,
      iconSrc: "",
      displayPos: {
         top: -5.5,
         left: -10
      },
      children: ["microsoft-antivirus"]
   },
   {
      name: "chunky",
      description: 'Becomes enraged when closed too many times - appeasement is required.',
      flavourText: "The Lord, precursor of His peoples.",
      cost: 20,
      iconSrc: "",
      displayPos: {
         top: -18,
         left: -4
      },
      children: ["microsoft-antivirus"]
   }
]

export default POPUP_DATA;