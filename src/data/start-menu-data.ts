export interface MenuInfo {
   name: string;
   iconSrc: string;
   tree: ReadonlyArray<MenuInfo> | string | null;
}
const MENU_DATA: ReadonlyArray<MenuInfo> = [
   {
      name: "Church of Lorem",
      iconSrc: "church-of-lorem/temple.png",
      tree: [
         {
            name: "The Oracle",
            iconSrc: "church-of-lorem/temple.png",
            tree: "oracle"
         },
         {
            name: "The Altar",
            iconSrc: "church-of-lorem/temple-os.png",
            tree: null
         }
      ]
   },
   {
      name: "Applications",
      iconSrc: "icons/picture.png",
      tree: "applicationShop"
   },
   {
      name: "Preferences",
      iconSrc: "icons/save.png",
      tree: "preferences"
   },
   {
      name: "Settings",
      iconSrc: "icons/settings.png",
      tree: "settings"
   },
   {
      name: "Help",
      iconSrc: "icons/home.png",
      tree: [
         {
            name: "Guide",
            iconSrc: "win95/books.png",
            tree: null
         },
         {
            name: "FaQ",
            iconSrc: "win95/properties.png",
            tree: null
         },
         {
            name: "Issues",
            iconSrc: "win95/error.png",
            tree: null
         }
      ]
   }
];

export default MENU_DATA;