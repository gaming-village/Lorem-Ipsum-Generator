import { useState } from 'react';
import ACHIEVEMENTS, { Achievement, AchievementCategory } from '../../data/achievements-data';
import { createNotification } from '../../notifications';
import Application, { ApplicationCategory } from './Application';

const findAchievement = (id: string): Achievement | null => {
   for (const achievement of ACHIEVEMENTS) {
      if (achievement.id === id) return achievement;
   }
   return null;
}
export function unlockAchievement(id: string): void {
   const achievement = findAchievement(id);
   if (achievement === null) {
      console.error(`Couldn't find an achievement with an id of '${id}'!`);
      return;
   }
   if (achievement.isUnlocked) return;

   achievement.isUnlocked = true;

   createNotification({
      iconSrc: "settings.png",
      title: achievement.name,
      description: achievement.description,
      caption: "New achievement!"
   }, false, true);
}

enum FilterTypes {
   category = "Category"
}
enum DisplayTypes {
   grid = "Grid",
   strips = "Strips"
}

const categoryFilter = (displayType: DisplayTypes): ReadonlyArray<JSX.Element> => {
   let key = 0;
   const arr = new Array<JSX.Element>();

   const filteredAchievements: { [key: string]: Array<Achievement> } = {};
   for (const achievement of ACHIEVEMENTS) {
      if (!filteredAchievements.hasOwnProperty(achievement.category)) {
         filteredAchievements[achievement.category] = new Array<Achievement>();
      }
      filteredAchievements[achievement.category].push(achievement);
   }

   for (const categoryName of Object.values(AchievementCategory)) {
      arr.push(
         <h2 key={key++}>{categoryName}</h2>
      );

      const achievementArr = new Array<JSX.Element>();
      let containerClassName = "achievement-container";
      if (displayType === DisplayTypes.grid) {
         containerClassName += " grid";
      } else if (displayType === DisplayTypes.strips) {
         containerClassName += " strips";
      }

      const achievements = filteredAchievements[categoryName];
      for (const achievement of achievements) {
         let achievementSrc;
         try {
            achievementSrc = require("../../images/icons/" + achievement.iconSrc).default;
         } catch {
            achievementSrc = require("../../images/icons/questionmark.png").default;
         }

         achievementArr.push(
            <div key={key++} className="achievement">
               <img src={achievementSrc} alt={achievement.name} />
               <div>
                  <p className="name">{achievement.isUnlocked ? achievement.name : "???"}</p>
                  <p className="description">{achievement.isUnlocked ? achievement.description : "???"}</p>
               </div>
               <div className="bg"></div>
            </div>
         );
      }
      arr.push(
         <div key={key++} className={containerClassName}>
            {achievementArr}
         </div>
      );
   }

   return arr;
}

interface ElemProps {
   application: AchievementTracker;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.category);
   const [displayType, setDisplayType] = useState<DisplayTypes>(DisplayTypes.strips);

   let achievements!: ReadonlyArray<JSX.Element>;
   if (filterType === FilterTypes.category) {
      achievements = categoryFilter(displayType);
   }

   const viewOptions = new Array<JSX.Element>();
   for (let i = 0; i < Object.keys(DisplayTypes).length; i++) {
      const displayName = Object.values(DisplayTypes)[i];
      const clickEvent = (): void => {
         setDisplayType(displayName);
      }

      viewOptions.push(
         <div className="display-type" onClick={clickEvent} key={i}>
            <div className="name">{displayName}</div>
         </div>
      )
   }

   return <div className="formatter">
      <div className="left-column">
         <h2>Overview</h2>
         <p className="achievement-count">Achievements: 0/??? <i>(0%)</i></p>
         <p className="motivation"></p>

         <h2>Display Mode</h2>
         <p className="caption">How the achievements are displayed.</p>
         <div className="view-options-container">
            {viewOptions}
         </div>

         <h2>Filter</h2>
         <p className="caption">Filter your achievements based on certain criteria.</p>
         <div className="filter-container"></div>
         <input className="search-achievements hidden" type="text" placeholder="Search achievements..." />
      </div>

      <div className="seperator"></div>

      <div className="right-column">
         <h1>Achievements</h1>
         {achievements}
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