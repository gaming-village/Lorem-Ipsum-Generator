import { useCallback, useEffect, useRef, useState } from "react";

import StartIcon from "../images/start-icon.png";

import Game from "../Game";
import MENU_DATA, { MenuInfo } from "../data/start-menu-data";
import Program from "../classes/programs/Program";
import ReactDOM from "react-dom";
import { Point } from "../utils";

export let showStartMenu: () => void;

let openStartMenu: () => void;
let closeStartMenu: () => void;

/* Example Start Menu structure:

MENU
  -> Panel
    -> MENU
      -> Panel
      -> Panel
      -> Panel
  -> Panel
  -> Panel
*/

const getProgramVisibility = (programName: string): boolean => {
   const program = Game.programs[programName] as Program;
   if (typeof program === "undefined") return false;
   return program.isOpened;
}

interface PanelProps {
   menu: MenuInfo;
   openFunc: (menu: MenuInfo, position: Point) => void;
   isOpened: boolean;
}
const Panel = ({ menu, openFunc, isOpened }: PanelProps): JSX.Element => {
   const panelRef = useRef<HTMLDivElement | null>(null);
   const [programIsOpened, setProgramIsOpened] = useState<boolean>(typeof menu.tree === "string" ? getProgramVisibility(menu.tree) : false);

   const toggleProgramVisibility = (programName: string): void => {
      const program = Game.programs[programName] as Program;
      program.isOpened ? program.close() : program.open();

      setProgramIsOpened(program.isOpened);
   }

   const clickEvent = (): void => {
      if (typeof menu.tree === "object") {
         const panel = panelRef.current!;

         // Calculate the position of the new menu
         const left = panel.offsetLeft + panel.offsetWidth + 2;
         const top = -panel.offsetTop + 94;
         const position = new Point(left, top);

         // Create the new menu
         openFunc(menu, position);
      } else {
         // Toggle the program
         toggleProgramVisibility(menu.tree as string);
      }
   }

   let iconSrc!: string;
   try {
      iconSrc = require("../images/" + menu.iconSrc).default;
   } catch {
      iconSrc = require("../images/icons/questionmark.png").default;
   }

   return <div onClick={clickEvent} className={`panel${isOpened ? " opened" : ""}${programIsOpened ? " program-opened" : ""}`} ref={panelRef}>
      <img src={iconSrc} alt="" />
      <p>{menu.name}</p>

      { typeof menu.tree === "object" ? (
         <div className="arrow"></div>
      ) : undefined }
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
         left: position.x,
         bottom: Math.max(position.y, -2)
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

   const menu = <Menu panels={panels} position={position} />

   ReactDOM.render(menu, container);

   return container;
}

let closeStartMenuButton: () => void;

let menuContainers = new Array<HTMLElement>();
const StartMenu = (): JSX.Element => {
   const mouseMove = (): void => {
      const event = window.event as MouseEvent;
      if ((event.target as HTMLElement).id === "computer") {
         closeStartMenu();
         closeStartMenuButton();
      }
   }

   useEffect(() => {
      openStartMenu = (): void => {
         const parent = document.getElementById("taskbar")!;
         createMenu(MENU_DATA.slice(), parent);

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