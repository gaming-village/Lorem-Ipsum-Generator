import { useCallback, useEffect, useRef, useState } from "react";

import StartIcon from "../images/start-icon.png";
import QuestionMark from "../images/icons/questionmark.png";

import Game from "../Game";
import START_MENU_DATA, { MenuInfo } from "../data/start-menu-data";
import Program from "../classes/programs/Program";
import ReactDOM from "react-dom";
import { roundNum, Point } from "../utils";
import { createTooltip, removeTooltip } from "../tooltips";
import { getLetterBySubject } from "./media/Mail";

export let showStartMenu: () => void;

let openStartMenu: () => void;
let closeStartMenu: () => void;

/* Example Start Menu structure:

START MENU
  -> Panel
    -> MENU
      -> Panel
      -> Panel
      -> Panel
  -> Panel
  -> Panel

*/

const startMenuSectionIsUnlocked = (menu: MenuInfo): boolean => {
   if (menu.isUnlocked) return true;

   if (typeof menu.unlockRequirements !== "undefined") {
      if (typeof menu.unlockRequirements.wordsTyped !== "undefined") {
         if (Game.stats.wordsTyped < menu.unlockRequirements.wordsTyped) return false;
      }

      if (typeof menu.unlockRequirements.totalLoremGenerated !== "undefined") {
         if (Game.stats.totalLoremGenerated < menu.unlockRequirements.totalLoremGenerated) return false;
      }

      if (typeof menu.unlockRequirements.letterRewardIsClaimed !== "undefined") {
         const letter = getLetterBySubject(menu.unlockRequirements.letterRewardIsClaimed);
         if (typeof letter.reward === "undefined") {
            throw new Error("Requested letter doesn't have a reward!");
         }
         return typeof letter.reward.isClaimed === "undefined" ? false : letter.reward.isClaimed;
      }

      menu.isUnlocked = true;
      return true;
   }
   throw new Error("Menu wasn't unlocked but didn't had requirements");
}

const createError = (): void => {
   const event = window.event as MouseEvent;

   const position = {
      left: event.clientX + 10 + "px",
      top: event.clientY + "px"
   };

   const content = <>
      <p>Looks like I haven't made this program yet...</p>
      <p>Yell at me on github and I'll probably get around to it.</p>
   </>;

   const tooltip = createTooltip(position, content);

   // Hide the tooltip when the user moves their mouse
   const mouseMove = (): void => {
      removeTooltip(tooltip);

      window.removeEventListener("mousemove", mouseMove);
   }
   window.addEventListener("mousemove", mouseMove);
}

const getProgramVisibility = (programName: string): boolean => {
   const program = Game.programs[programName] as Program;
   if (typeof program === "undefined") return false;
   return program.isOpened;
}

const getMenuRequirementsJSX = (menu: MenuInfo): JSX.Element => {
   if (typeof menu.unlockRequirements === "undefined") {
      throw new Error("Tried to create requirements JSX but was undefined!");
   }

   return <ul>
      {Object.entries(menu.unlockRequirements).map(([requirementName, val], i) => {
         let content!: JSX.Element;
         switch (requirementName) {
            case "wordsTyped": {
               const colour = Game.stats.wordsTyped >= Number(val) ? "green" : "red";
               content = <>Words typed: <span style={{color: colour}}>{Game.stats.wordsTyped} / {val}</span></>;
               break;
            }
            case "totalLoremGenerated": {
               const colour = Game.stats.totalLoremGenerated >= Number(val) ? "green" : "red";
               content = <>Total lorem generated: <span style={{color: colour}}>{roundNum(Game.stats.totalLoremGenerated)} / {val}</span></>;
               break;
            }
            case "letterRewardIsClaimed": {
               const isUnlocked = getLetterBySubject(val as string).reward!.isClaimed || false;
               const colour = isUnlocked ? "green" : "red";
               content = <>{val}: <span style={{color: colour}}>{isUnlocked ? "Claimed" : "Unclaimed"}</span></>;
               break;
            }
         }

         return <li key={i}>{content}</li>
      })}
   </ul>;
}

interface PanelProps {
   menu: MenuInfo;
   openFunc: (menu: MenuInfo, position: Point) => void;
   isOpened: boolean;
}
const Panel = ({ menu, openFunc, isOpened }: PanelProps): JSX.Element => {
   const panelRef = useRef<HTMLDivElement | null>(null);
   const [programIsOpened, setProgramIsOpened] = useState<boolean>(typeof menu.tree === "string" ? getProgramVisibility(menu.tree) : false);
   const tooltip = useRef<HTMLElement | null>(null);

   const toggleProgramVisibility = (programName: string): void => {
      const program = Game.programs[programName] as Program;
      program.isOpened ? program.close() : program.open();

      setProgramIsOpened(program.isOpened);
   }

   const clickEvent = (): void => {
      if (typeof menu.tree === "object" && menu.tree !== null) {
         const panel = panelRef.current!;
         console.log(panel);

         // Calculate the position of the new menu
         const left = panel.offsetLeft + panel.offsetWidth + 2;
         const top = -panel.offsetTop + 94;
         const position = new Point(left, top);

         // Create the new menu
         openFunc(menu, position);
      } else {
         if (typeof menu.tree === "string") {
            // If the program exists, toggle its visibility
            toggleProgramVisibility(menu.tree as string);
         } else {
            // If the program doesn't exist, show an error message
            createError();
         }
      }
   }

   const deleteTooltip = (): void => {
      if (tooltip.current !== null) {
         removeTooltip(tooltip.current);
      }
   }

   useEffect(() => {
      return () => {
         deleteTooltip();
      }
   }, []);

   const showLockedTooltip = (): void => {
      const bounds = panelRef.current!.getBoundingClientRect();

      const position = {
         left: bounds.x + bounds.width/2 + "px",
         top: bounds.y + bounds.height/2 + "px"
      };

      const content = <>
         <p><b>You haven't unlocked this panel yet!</b></p>

         {getMenuRequirementsJSX(menu)}
      </>;

      tooltip.current = createTooltip(position, content);
   }

   let iconSrc!: string;
   try {
      iconSrc = require("../images/" + menu.iconSrc).default;
   } catch {
      iconSrc = require("../images/icons/questionmark.png").default;
   }

   const isUnlocked = startMenuSectionIsUnlocked(menu);

   let className = "panel";
   if (isUnlocked) {
      if (isOpened) className += " opened";
      if (programIsOpened) className += " program-opened";
   } else {
      className += " locked";
   }

   return <div onClick={isUnlocked ? clickEvent : undefined} className={className} ref={panelRef} onMouseEnter={!isUnlocked ? showLockedTooltip : undefined} onMouseLeave={!isUnlocked ? deleteTooltip : undefined}>
      {isUnlocked ? <>
         <img src={iconSrc} alt="" />
         <p>{menu.name}</p>

         { typeof menu.tree === "object" && menu.tree !== null ? (
            <div className="arrow"></div>
            ) : undefined }
      </> : <>
         <img src={QuestionMark} alt="" />

         <p>???</p>
      </>}
   </div>;
}

interface MenuProps {
   panels: ReadonlyArray<MenuInfo>;
   position?: Point;
}
const Menu = ({ panels, position }: MenuProps): JSX.Element => {
   const menuRef = useRef<HTMLDivElement | null>(null);
   const [openedMenu, setOpenedMenu] = useState<MenuInfo | null>(null);
   const openedMenuContainer = useRef<HTMLElement | null>(null);

   let style!: React.CSSProperties;
   if (typeof position === "undefined") {
      style = {
         left: 0,
         bottom: "calc(2rem + 6px)"
      };
   } else {
      style = {
         left: position.x + "px",
         bottom: Math.max(position.y, -2) + "px"
      }
   }

   const openMenu = (menu: MenuInfo, position: Point): void => {
      if (openedMenu !== null) {
         ReactDOM.unmountComponentAtNode(openedMenuContainer.current!);
         openedMenuContainer.current!.remove();
      }

      if (openedMenu === menu) {
         setOpenedMenu(null);
         return;
      }

      const panels = menu.tree as ReadonlyArray<MenuInfo>;
      openedMenuContainer.current = createMenu(panels, menuRef.current!, position);

      setOpenedMenu(menu);
   }

   return <div ref={menuRef} style={style} className="menu">
      { panels.map((panel, i) => {
         return <Panel menu={panel} openFunc={openMenu} isOpened={panel === openedMenu} key={i} />;
      }) }
   </div>;
}

const createMenu = (panels: ReadonlyArray<MenuInfo>, parent: HTMLElement, position?: Point): HTMLElement => {
   const container = document.createElement("div");
   menuContainers.push(container);
   parent.appendChild(container);

   const menu = <Menu panels={panels} position={position} />;

   ReactDOM.render(menu, container);

   return container;
}

let closeStartMenuButton: () => void;

let menuContainers = new Array<HTMLElement>();
const StartMenu = (): JSX.Element => {
   const mouseMove = (): void => {
      const event = window.event as MouseEvent;
      const path = event.composedPath();

      for (const elem of path as Array<HTMLElement>) {
         if (elem.id === "taskbar") return;
      }
      
      closeStartMenu();
      closeStartMenuButton();
   }

   useEffect(() => {
      openStartMenu = (): void => {
         const parent = document.getElementById("taskbar")!;
         createMenu(START_MENU_DATA.slice(), parent);

         window.addEventListener("mousemove", mouseMove);
      }

      closeStartMenu = (): void => {
         for (const container of menuContainers) {
            ReactDOM.unmountComponentAtNode(container);
            container.remove();
         }

         window.removeEventListener("mousemove", mouseMove);
      }
   }, []);

   return <></>;
}

const TaskBar = () => {
   const [startMenuIsUnlocked, setStartMenuIsUnlocked] = useState(Game.misc.startMenuIsUnlocked);
   const [startMenuIsOpened, setStartMenuIsOpened] = useState(false);

   closeStartMenuButton = (): void => {
      setStartMenuIsOpened(false);
   }

   const toggleStartMenuVisibility = useCallback(() => {
      if (startMenuIsOpened) {
         closeStartMenu();
         setStartMenuIsOpened(false);
      } else {
         openStartMenu();
         setStartMenuIsOpened(true);
      }
   }, [startMenuIsOpened]);

   useEffect(() => {
      showStartMenu = (): void => {
         setStartMenuIsUnlocked(true);
      }
   }, []);

   return <div id="taskbar">
      { startMenuIsUnlocked ? <>
         <div onClick={toggleStartMenuVisibility} id="start-button" className={`taskbar-item${startMenuIsOpened ? " opened" : ""}`}>
            <img src={StartIcon} alt="" />
            <div className="text">Start</div>
         </div>

         <StartMenu />
      </> : undefined }
   </div>;
}

export default TaskBar;