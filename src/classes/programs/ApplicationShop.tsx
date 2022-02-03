import Game from "../../Game";
import Program from "./Program";

interface ElemProps {
   program: ApplicationShop;
}
const Elem = ({ program }: ElemProps): JSX.Element => {
   const applicationTabs: ReadonlyArray<JSX.Element> = Object.values(Game.programs).map((currentProgram, i) => {
      return <div key={i}>
         <p className="name">{currentProgram.name}</p>
         <p className="description">{currentProgram.description}</p>
         <button className="button">{currentProgram.cost}</button>
      </div>
   });

   return <>
      <p>Application shop test</p>

      {applicationTabs}
   </>;
}

class ApplicationShop extends Program {
   constructor() {
      super({
         name: "Application Shop",
         id: "applicationShop"
      });
   }

   protected instantiate(): JSX.Element {
      return <Elem program={this} />;
   }

   setup(): void {
      // TODO: Write stuff
   }
}

export default ApplicationShop;