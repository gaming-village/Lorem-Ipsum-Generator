import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import "../css/navbar.css";
import { getElem } from "../utils";
import Game from "../Game";

export let switchView!: (view: number | string) => void;

interface ViewInfo {
   elemID: string;
   name: string;
   isSelected: boolean;
   isUnlockable?: boolean;
}
const VIEW_DATA: ReadonlyArray<ViewInfo> = [
   {
      elemID: "computer",
      name: "Computer",
      isSelected: true
   },
   {
      elemID: "media",
      name: "Media",
      isSelected: false
   },
   {
      elemID: "corporate-overview",
      name: "Corporate Overview",
      isSelected: false,
      isUnlockable: true
   },
   {
      elemID: "black-market",
      name: "Black Market",
      isSelected: false,
      isUnlockable: true
   }
];

const updateVisibleViews = (views: ReadonlyArray<ViewInfo>) => {
   for (const view of views) {
      const elem = getElem(view.elemID);
      if (!view.isSelected) {
         elem.classList.add("hidden");
      } else {
         elem.classList.remove("hidden");
      }
   }
}

/**
 * Gets all views available by default (a.k.a)
 */
const getDefaultViews = (): Array<ViewInfo> => {
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

export function setupNavBar(): void {
   updateVisibleViews(VIEW_DATA);
}

export let unlockView: (viewName: string) => void;

const NavBar = () => {
   const [views, setViews] = useState(getDefaultViews());

   const updateViewsArr = useCallback((elemID: string) => {
      Game.currentView = elemID;

      const newViewArr = views.slice();
      for (const currentView of newViewArr) {
         currentView.isSelected = currentView.elemID === elemID;
      }
      setViews(newViewArr);
   }, [views]);

   useEffect(() => {
      switchView = (view: number | string) => {
         if (typeof view === "string") {
            updateViewsArr(view);
         } else {
            if (view + 1 > views.length) return;
            updateViewsArr(views[view].elemID);
         }

         updateVisibleViews(views);
      }
   }, [updateViewsArr, views]);

   const unlockViewFunc = useCallback((viewName: string) => {
      const newViewArr = views.slice();

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

      if (newViewArr.indexOf(view) !== -1) {
         return;
      }
      newViewArr.push(view);

      setViews(newViewArr);
   }, [views]);

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

   const navButtons = views.map((view, i) => {
      return <Button onClick={() => switchView(i)} key={i} className={!view.isSelected ? "dark" : ""}>{view.name}</Button>;
   });

   return <div id="top-bar">
      <div className="formatter">
         {navButtons}
      </div>
   </div>;
}

export default NavBar;