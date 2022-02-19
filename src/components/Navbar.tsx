import React, { useEffect, useState } from "react";
import Button from "./Button";
import "../css/navbar.css";
import { getElem } from "../utils";

export let switchView!: (view: number | string) => void;

interface ViewInfo {
   elemID: string;
   text: string;
   isSelected: boolean;
   isCustom?: boolean;
}
const defaultViews: ReadonlyArray<ViewInfo> = [
   {
      elemID: "computer",
      text: "Computer",
      isSelected: true
   },
   {
      elemID: "mail",
      text: "Mail",
      isSelected: false
   },
   {
      elemID: "corporate-overview",
      text: "Corporate Overview",
      isSelected: false
   },
   {
      elemID: "black-market",
      text: "Black Market",
      isSelected: false,
      isCustom: true
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

export function setupNavBar(): void {
   updateVisibleViews(defaultViews);
}

const NavBar = () => {
   const [views, setViews] = useState(defaultViews.slice());

   const updateViewsArr = (elemID: string) => {
      const newViewArr = views.slice();
      for (const currentView of newViewArr) {
         currentView.isSelected = currentView.elemID === elemID;
      }
      setViews(newViewArr);
   };

   useEffect(() => {
      switchView = (view: number | string) => {
         if (typeof view === "string") {
            updateViewsArr(view);
         } else {
            if (view + 1 > defaultViews.length) return;
            updateViewsArr(views[view].elemID);
         }

         updateVisibleViews(views);
      }
   }); 

   const navButtons = views.map((view, i) => {
      return <Button onClick={() => switchView(i)} key={i} className={!view.isSelected ? "dark" : ""}>{view.text}</Button>;
   });

   return <div id="top-bar">
      <div className="formatter">
         {navButtons}
      </div>
   </div>;
}

export default NavBar;