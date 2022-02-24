import "../css/computer.css";
import "../css/programs.css";

import FileSystem from "./FileSystem";
import LoremProductionSystem from "./LoremProductionSystem";
// import PopupContainer from "./PopupContainer";
import TaskBar from "./Taskbar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <LoremProductionSystem />

         <FileSystem />

         {/* <PopupContainer /> */}
         <div id="popup-container"></div>

         <TaskBar />
      </div>
   );
}

export default Computer;