import { getElem } from "./utils";


interface PanelData {
   name: string;
   imgSrc: string;
   tree: object;
}

const startMenuTree = {
   test: {
      name: "test",
      imgSrc: "/images/icons/picture.png",
      tree: {
         test2: {
            name: "test2",
            imgSrc: "/images/win95/folder-search.png",
            tree: {
               test4: {
                  name: "test4",
                  imgSrc: "/images/win95/folder-search.png",
                  tree: "testingGamer"
               }
            }
         },
         test3: {
            name: "test3",
            imgSrc: "/images/win95/info.png",
            tree: ""
         }
      }
   },
   applications: {
      name: "Applications",
      imgSrc: "/images/icons/picture.png",
      tree: {
         shop: {
            name: "Shop",
            imgSrc: "/images/win95/folder-search.png",
            tree: "menu-application-shop"
         },
         status: {
            name: "Status",
            imgSrc: "/images/win95/info.png",
            tree: ""
         }
         // TODO: Manager/Management?
      }
   },
   preferences: {
      name: "Preferences",
      imgSrc: "/images/icons/save.png",
      tree: "menu-preferences"
   },
   help: {
      name: "Help",
      imgSrc: "/images/icons/home.png",
      tree: {
         guide: {
            name: "Guide",
            imgSrc: "/images/win95/books.png",
            tree: ""
         },
         faq: {
            name: "FaQ",
            imgSrc: "/images/win95/properties.png",
            tree: ""
         },
         issues: {
            name: "Issues",
            imgSrc: "/images/win95/error.png",
            tree: ""
         }
      }
   }
};

const createPanel = (panelData: PanelData, panelContainer: HTMLElement) => {
   const panel = document.createElement("div");
   panel.className = "panel";
   panel.innerHTML = `
   <img src="${panelData.imgSrc}" alt="" />
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
      // Root start menu panel container

      panelContainer.id = id;

      getElem("computer")?.appendChild(panelContainer);
      panelContainer.style.bottom = "calc(2rem + 6px)";
   }

   return panelContainer;
}

const findPanelParent = (targetPanelData: PanelData, currentParentDatas: object[] = [startMenuTree]): PanelData => {
   // Recursively search of the parent of a panel data
   let parentDatasToSearch: object[] = [];
   for (const currentParentData of currentParentDatas) {
      for (const panelData of Object.values(currentParentData)) {
         if (panelData === targetPanelData) {
            return (currentParentData as PanelData);
         }
         if (typeof panelData.tree === "object") parentDatasToSearch.push(panelData.tree);
      }
   }
   return findPanelParent(targetPanelData, parentDatasToSearch);
}

const populatePanelContainer = (panelContainer: HTMLElement, panelContainerTree: object) => {
   for (const panelData of Object.entries(panelContainerTree)) {
      const panel = createPanel(panelData[1], panelContainer);

      // If the panel opens another panel container
      if (typeof panelData[1].tree === "object") {
         // Create the opening arrow icon
         createOpeningArrow(panel);

         panel.addEventListener("click", () => {
            const previouslyOpenedPanel = panelContainer.querySelector(".panel.opened");
            if (previouslyOpenedPanel !== panel) {
               previouslyOpenedPanel?.classList.remove("opened");
               panel.classList.add("opened");

               // Remove any other panel containers
               const panelDataParent = findPanelParent(panelData[1]);
               for (const name of Object.keys(panelDataParent)) {
                  const potentialPanelContainer = getElem("start-menu-" + name);
                  if (potentialPanelContainer) potentialPanelContainer.remove();
               }

               const newPanelContainer = createPanelContainer(panelData[0], panelContainer, panel);
               populatePanelContainer(newPanelContainer, panelData[1].tree);
            } else {
               panel.classList.remove("opened");

               getElem("start-menu-" + panelData[0])?.remove();
            }
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
   console.log(getElem("start-menu"));
   return getElem("start-menu") !== undefined;
}
const closeStartMenu = () => {
   getElem("start-menu")?.remove();
}
const closeMenuOnHoverOut = (startMenu: HTMLElement) => {
   startMenu.addEventListener("mouseleave", () => {
      closeStartMenu();
   });
}
export function setupStartMenu() {
   const startIcon = getElem("taskbar")?.querySelector(".start-icon");
   startIcon?.addEventListener("click", () => {
      if (!startMenuIsOpen()) {
         // Open the start menu

         const startMenu = createPanelContainer("start-menu");
         populatePanelContainer(startMenu, startMenuTree);
         closeMenuOnHoverOut(startMenu);
      } else {
         // Close the start menu

         closeStartMenu();
      }
   });
}