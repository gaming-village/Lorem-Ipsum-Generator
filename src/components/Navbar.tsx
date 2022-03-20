import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./Button";
import "../css/navbar.css";
import { getElem } from "../utils";
import Game from "../Game";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

export let switchView!: (view: number | string) => void;

interface ViewInfo {
   readonly name: string;
   readonly type: "element" | "page";
   readonly tooltipContent: JSX.Element | null;
   isSelected: boolean;
   readonly isUnlockable?: boolean;
}

interface ElementView extends ViewInfo {
   readonly elemID: string;
}
interface PageView extends ViewInfo {
   readonly pageUrl: string;
}

const VIEW_DATA: ReadonlyArray<ElementView | PageView> = [
   {
      name: "Computer",
      type: "element",
      tooltipContent: null,
      elemID: "computer",
      isSelected: true
   },
   {
      name: "Media",
      type: "element",
      tooltipContent: null,
      elemID: "media",
      isSelected: false
   },
   {
      name: "Corporate Overview",
      type: "element",
      tooltipContent: null,
      elemID: "corporate-overview",
      isSelected: false,
      isUnlockable: true
   },
   {
      name: "Black Market",
      type: "element",
      tooltipContent: null,
      elemID: "black-market",
      isSelected: false,
      isUnlockable: true
   },
   {
      name: "Prestige",
      type: "page",
      tooltipContent: <>
         <p>testing123!!</p>
         <p>I am gaming right now</p>
      </>,
      pageUrl: "/prestige-tree",
      isSelected: false,
      isUnlockable: false
   }
];

interface NavbarTooltipProps {
   button: HTMLButtonElement;
   content: JSX.Element;
   removeFunc: () => void;
}
const NavbarTooltip = ({ button, content, removeFunc }: NavbarTooltipProps): JSX.Element => {
   const [xPos, setXPos] = useState((window.event as MouseEvent).clientX);

   const mouseMove = useCallback((): void => {
      const event = window.event as MouseEvent;

      if (event.target !== button) {
         removeFunc();
         return;
      }

      // Update pos
      setXPos(event.clientX);
   }, [button, removeFunc]);

   useEffect(() => {
      window.addEventListener("mousemove", mouseMove);

      return () => {
         window.removeEventListener("mousemove", mouseMove);
      }
   }, [mouseMove]);

   const style: React.CSSProperties = {
      left: xPos + "px"
   };

   return <div style={style} className="navbar-tooltip">
      {content}
   </div>;
}

const createNavbarTooltip = (button: HTMLButtonElement, content: JSX.Element): void => {
   const container = document.createElement("div");
   document.getElementById("computer")!.appendChild(container);

   const removeFunc = (): void => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
   }

   const tooltip = <NavbarTooltip button={button} content={content} removeFunc={removeFunc} />
   ReactDOM.render(tooltip, container);
}

/**
 * Gets all views available by default
 */
 const getDefaultUnlockedViews = (): Array<ViewInfo> => {
   let defaultViews = VIEW_DATA.slice();

   // Remove the black market
   for (let i = 0; i < defaultViews.length; i++) {
      const view = defaultViews[i];
      if (view.isUnlockable) {
         defaultViews.splice(i, 1);
         i--;
      }
   }

   return defaultViews;
}

/**
 * Shows the currently selected view and hides all others
 * @param views The view array
 */
const updateVisibleViews = (views: ReadonlyArray<ViewInfo>) => {
   for (const view of views) {
      if (view.type !== "element") continue;

      const elem = getElem((view as ElementView).elemID);
      if (view.isSelected) {
         elem.classList.remove("hidden");
      } else {
         elem.classList.add("hidden");
      }
   }
}

export function setupNavBar(): void {
   updateVisibleViews(VIEW_DATA);
}

export let unlockView: (viewName: string) => void;

interface NavbarButtonProps {
   view: ViewInfo;
   isUnlocked: boolean;
}
const NavbarButton = ({ view, isUnlocked }: NavbarButtonProps) => {
   const buttonRef = useRef<HTMLButtonElement | null>(null);

   const mouseOver = useCallback((): void => {
      const button = buttonRef.current!;
      createNavbarTooltip(button, view.tooltipContent!);
   }, [view.tooltipContent]);

   useEffect(() => {
      const button = buttonRef.current!;

      if (view.tooltipContent !== null) {
         button.addEventListener("mouseover", mouseOver);
      }

      return () => {
         button.removeEventListener("mouseover", mouseOver);
      }
   }, [mouseOver, view.tooltipContent]);

   if (!isUnlocked) {
      return <Button ref={buttonRef} className="darker">???</Button>;
   }

   switch (view.type) {
      case "element": {
         return <Button ref={buttonRef} onClick={() => switchView(view.name)} isDark={!view.isSelected}>{view.name}</Button>;
      }
      case "page": {
         return <Link to={(view as PageView).pageUrl}>
            <Button ref={buttonRef} isDark={!view.isSelected}>{view.name}</Button>
         </Link>;
      }
      default: {
         return null;
      }
   }
}

const Navbar = () => {
   const [views, setViews] = useState<Array<ViewInfo>>(VIEW_DATA.slice());
   const [unlockedViews, setUnlockedViews] = useState<Array<ViewInfo>>(getDefaultUnlockedViews());

   const updateSelectedView = useCallback((view: ViewInfo) => {
      if (view.hasOwnProperty("elemID")) {
         Game.currentView = (view as ElementView).elemID;
      }

      const newViewArr = views.slice();
      for (const currentView of newViewArr) {
         currentView.isSelected = currentView === view;
      }
      setViews(newViewArr);
   }, [views]);

   useEffect(() => {
      switchView = (viewIdentifier: number | string) => {
         if (typeof viewIdentifier === "string") {
            // Find the corresponding view
            let view!: ViewInfo;
            for (const currentView of VIEW_DATA) {
               if (currentView.name === viewIdentifier) {
                  view = currentView;
                  break;
               }
            }
            if (typeof view === "undefined") {
               throw new Error(`Couldn't find a view with the name '${viewIdentifier}'!`);
            }

            updateSelectedView(view);
         } else {
            if (viewIdentifier + 1 > views.length) return;
            updateSelectedView(views[viewIdentifier]);
         }

         updateVisibleViews(views);
      }
   }, [updateSelectedView, views]);

   const unlockViewFunc = useCallback((viewName: string) => {
      const newUnlockedViews = unlockedViews.slice();

      let view: ViewInfo | undefined;
      for (const currentView of VIEW_DATA) {
         if (currentView.name === viewName) {
            view = currentView;
            break;
         }
      }
      if (typeof view === "undefined") {
         throw new Error(`View with name ${viewName} doesn't exist!`);
      }

      if (newUnlockedViews.indexOf(view) !== -1) {
         return;
      }
      newUnlockedViews.push(view);

      setUnlockedViews(newUnlockedViews);
   }, [unlockedViews]);

   useEffect(() => {
      unlockView = (viewName: string): void => {
         unlockViewFunc(viewName);
      }
      
      if (Game.misc.blackMarketIsUnlocked) {
         unlockView("Black Market");
      }
      if (Game.misc.corporateOverviewIsUnlocked) {
         unlockView("Corporate Overview");
      }
   }, [unlockViewFunc]);

   const navButtons = VIEW_DATA.map((view, i) => {
      const isUnlocked = unlockedViews.includes(view);
      return <NavbarButton view={view} isUnlocked={isUnlocked} key={i} />
   });

   return <div id="top-bar">
      <div className="formatter">
         {navButtons}
      </div>
   </div>;
}

export default Navbar;