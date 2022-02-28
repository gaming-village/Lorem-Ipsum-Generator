import { elemExists, getElem } from "./utils";
import Program from './classes/programs/Program';
import Game from "./Game";


interface PanelData {
   name: string;
   imgSrc: string;
   tree: ReadonlyArray<PanelData> | string | null;
}
const MENU_DATA: ReadonlyArray<PanelData> = [
   {
      name: "Church of Lorem",
      imgSrc: "/images/church-of-lorem/temple.png",
      tree: [
         {
            name: "The Oracle",
            imgSrc: "/images/church-of-lorem/temple.png",
            tree: "oracle"
         },
         {
            name: "The Altar",
            imgSrc: "/images/church-of-lorem/temple-os.png",
            tree: "altar"
         }
      ]
   },
   {
      name: "Applications",
      imgSrc: "/images/icons/picture.png",
      tree: [
         {
            name: "Shop",
            imgSrc: "/images/icons/search-folder.png",
            tree: "applicationShop"
         },
         {
            name: "Status",
            imgSrc: "/images/icons/computer.png",
            tree: null
         }
         // TODO: Manager/Management?
      ]
   },
   {
      name: "Preferences",
      imgSrc: "/images/icons/save.png",
      tree: "preferences"
   },
   {
      name: "Settings",
      imgSrc: "/images/icons/settings.png",
      tree: "settings"
   },
   {
      name: "Help",
      imgSrc: "/images/icons/home.png",
      tree: [
         {
            name: "Guide",
            imgSrc: "/images/win95/books.png",
            tree: null
         },
         {
            name: "FaQ",
            imgSrc: "/images/win95/properties.png",
            tree: null
         },
         {
            name: "Issues",
            imgSrc: "/images/win95/error.png",
            tree: null
         }
      ]
   }
];

interface PanelReference {
   name: string;
   element: HTMLElement;
}
const panelReferences: Array<PanelReference> = new Array<PanelReference>();

const createPanel = (panelData: PanelData, panelContainer: HTMLElement) => {
   const panel = document.createElement("div");
   panel.className = "panel";

   let imgSrc: string = "";
   try {
      imgSrc = require("." + panelData.imgSrc).default;
   } catch {
      imgSrc = require("./images/icons/questionmark.png").default;
   }

   panel.innerHTML = `
   <img src=${imgSrc} alt="" />
   <p>${panelData.name}</p>`;

   panelContainer.appendChild(panel);

   return panel;
}
const createOpeningArrow = (panel: HTMLElement) => {
   const arrow = document.createElement("div");
   arrow.classList.add("arrow");
   panel.appendChild(arrow);
}

const createPanelContainer = (id: string, parent?: Element, parentPanel?: HTMLElement): HTMLElement => {
   const panelContainer = document.createElement("div");
   panelContainer.className = "start-menu-container";

   if (parent && parentPanel) {
      panelContainer.id = "start-menu-" + id;
      parent.appendChild(panelContainer);

      const panelBounds = parentPanel.getBoundingClientRect();
      const parentBounds = parent.getBoundingClientRect();
      const top = panelBounds.y - parentBounds.y - 2;
      panelContainer.style.top = top - 2 + "px";
      panelContainer.style.left = panelBounds.width + 2 + "px";
   } else {
      // Root start menu panel container b

      panelContainer.id = id;

      getElem("computer")?.appendChild(panelContainer);
      panelContainer.style.bottom = "calc(2rem + 6px)";
   }

   return panelContainer;
}

const toggleProgram = (programName: string): void => {
   const program = Game.programs[programName] as Program;
   program.isOpened ? program.close() : program.open();
}

const populatePanelContainer = (panelContainer: HTMLElement, panelTree: ReadonlyArray<PanelData>) => {
   for (const item of panelTree) {
      const panel = createPanel(item, panelContainer);

      // If the panel opens another panel container
      if (typeof item.tree === "object") {
         // Create the opening arrow icon
         createOpeningArrow(panel);

         panel.addEventListener("click", () => {
            const previouslyOpenedPanel = panelContainer.querySelector(".panel.opened");
            if (previouslyOpenedPanel !== panel) {
               previouslyOpenedPanel?.classList.remove("opened");
               panel.classList.add("opened");

               // Remove any sibling panel containers
               const siblingPanelNames = panelTree.map(panel => panel.name);
               for (const name of siblingPanelNames) {
                  for (const panelReference of panelReferences) {
                     if (panelReference.name === name) {
                        panelReference.element.remove();
                     }
                  }
               }

               const newPanelContainer = createPanelContainer("a", panelContainer, panel);
               populatePanelContainer(newPanelContainer, item.tree as Array<PanelData>);
               panelReferences.push({ name: item.name, element: newPanelContainer });
            } else {
               panel.classList.remove("opened");

               for (const panelReference of panelReferences) {
                  if (panelReference.name === item.name) {
                     panelReference.element.remove();
                     break;
                  }
               }
            }
         });
      } else if (typeof item.tree === "string") {
         panel.addEventListener("click", () => {
            toggleProgram(item.tree as string);
         });
      }
   }
   
   // If the panel container would go out of bounds, set it to the bottom
   const containerBounds = panelContainer.getBoundingClientRect();
   const remainingSpace = window.innerHeight - containerBounds.bottom;
   const taskbarHeight = (getElem("taskbar") as HTMLElement).offsetHeight;
   if (remainingSpace + 2 < taskbarHeight) {
      panelContainer.style.top = "";
      panelContainer.style.bottom = "-2px";
   }
}

const startMenuIsOpen = (): boolean => {
   return elemExists("start-menu");
}
const openStartMenu = (): void => {
   const startMenu = createPanelContainer("start-menu");
   populatePanelContainer(startMenu, MENU_DATA);
   closeMenuOnHoverOut(startMenu);

   const startButton = getElem("start-button")!;
   startButton.classList.add("opened");
}
const closeStartMenu = (): void => {
   getElem("start-menu")?.remove();

   const startButton = getElem("start-button")!;
   startButton.classList.remove("opened");
}
const closeMenuOnHoverOut = (startMenu: HTMLElement): void => {
   startMenu.addEventListener("mouseleave", () => {
      closeStartMenu();
   });
}
export function setupStartMenu() {
   const startButton = getElem("start-button")!;
   startButton.addEventListener("click", () => {
      if (!startMenuIsOpen()) {
         // Open the start menu
         openStartMenu();
      } else {
         // Close the start menu
         closeStartMenu();
      }
   });
}