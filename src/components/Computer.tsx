import FileSystem from "./FileSystem";
import LoremProductionSystem from "./LoremProductionSystem";
import TaskBar from "./Taskbar";

const Computer = () => {
   return (
      <div id="computer" className="view">
         <LoremProductionSystem />

         <FileSystem />

         <div id="popup-container"></div>

         <TaskBar />
      </div>
   );
}

export default Computer;