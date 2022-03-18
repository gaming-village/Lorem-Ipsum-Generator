export interface MenuInfo {
   readonly name: string;
   readonly iconSrc: string;
   readonly tree: ReadonlyArray<MenuInfo> | string | null;
   /** Any requirements before the menu/program is unlocked */
   readonly unlockRequirements?: {
      readonly wordsTyped?: number;
      readonly totalLoremGenerated?: number;
      readonly letterRewardIsClaimed?: string;
   }
   isUnlocked: boolean;
}
const START_MENU_DATA: ReadonlyArray<MenuInfo> = [
   {
      name: "Minigames",
      iconSrc: "",
      tree: [
         {
            name: "G.Y.O.L",
            iconSrc: "",
            tree: null,
            isUnlocked: true
         }
      ],
      unlockRequirements: {

      },
      isUnlocked: false
   },
   {
      name: "Church of Lorem",
      iconSrc: "church-of-lorem/temple.png",
      tree: [
         {
            name: "The Oracle",
            iconSrc: "church-of-lorem/temple.png",
            tree: "oracle",
            isUnlocked: true
         },
         {
            name: "The Altar",
            iconSrc: "church-of-lorem/temple-os.png",
            tree: null,
            isUnlocked: true
         }
      ],
      unlockRequirements: {
         letterRewardIsClaimed: "The Initiation"
      },
      isUnlocked: false
   },
   {
      name: "Applications",
      iconSrc: "icons/picture.png",
      tree: "applicationShop",
      unlockRequirements: {
         totalLoremGenerated: 5e5,
         wordsTyped: 1000
      },
      isUnlocked: false
   },
   {
      name: "Preferences",
      iconSrc: "icons/save.png",
      tree: "preferences",
      isUnlocked: true
   },
   {
      name: "Settings",
      iconSrc: "icons/settings.png",
      tree: "settings",
      isUnlocked: true
   },
   {
      name: "Help",
      iconSrc: "icons/home.png",
      tree: [
         {
            name: "Guide",
            iconSrc: "win95/books.png",
            tree: null,
            isUnlocked: true
         },
         {
            name: "FaQ",
            iconSrc: "win95/properties.png",
            tree: null,
            isUnlocked: true
         },
         {
            name: "Issues",
            iconSrc: "win95/error.png",
            tree: null,
            isUnlocked: true
         }
      ],
      isUnlocked: true
   }
];

export default START_MENU_DATA;