import Application, { ApplicationCategory } from './Application';

const categoryFilter = (): ReadonlyArray<JSX.Element> => {
   const arr = new Array<JSX.Element>();
}

interface ElemProps {
   application: AchievementTracker;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   return <div className="formatter">
      <div className="left-column">
         <h2>Overview</h2>
         <p className="achievement-count">Achievements: 0/??? <i>(0%)</i></p>
         <p className="motivation"></p>

         <h2>View Mode</h2>
         <p className="caption">How the achievements are displayed.</p>
         <div className="view-options-container"></div>

         <h2>Filter</h2>
         <p className="caption">Filter your achievements based on certain criteria.</p>
         <div className="filter-container"></div>
         <input className="search-achievements hidden" type="text" placeholder="Search achievements..." />
      </div>

      <div className="seperator"></div>

      <div className="right-column">
         <h1>Achievements</h1>
         <div className="achievement-container"></div>
      </div>
   </div>;
}

class AchievementTracker extends Application {
   constructor() {
      super({
         name: "Achievement Tracker",
         id: "achievementTracker",
         category: ApplicationCategory.lifestyle,
         description: "Achieve",
         cost: 5
      });
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default AchievementTracker;