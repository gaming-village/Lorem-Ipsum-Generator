import { useState } from 'react';
import Button from '../../components/Button';
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
      caption: "New achievement!",
      isClickable: false,
      hasCloseButton: true
   });
}

enum FilterTypes {
   category = "Category",
   unlocked = "Unlocked"
}
enum DisplayTypes {
   compact = "Compact",
   strips = "Strips"
}

interface FilterItem {
   type: "heading" | "achievement";
   content: Achievement | string;
}

const getCategoryFilter = (): ReadonlyArray<FilterItem> => {
   // Create the dictionary of sorted achievements.
   const filteredAchievements: { [key: string]: Array<Achievement> } = {};
   for (const categoryName of Object.values(AchievementCategory)) {
      filteredAchievements[categoryName] = new Array<Achievement>();
   }
   for (const achievement of ACHIEVEMENTS) {
      filteredAchievements[achievement.category].push(achievement);
   }

   let filterItems = new Array<FilterItem>();
   for (const [filterCategory, achievements] of Object.entries(filteredAchievements)) {
      filterItems.push({
         type: "heading",
         content: filterCategory
      });

      for (const achievement of achievements) {
         filterItems.push({
            type: "achievement",
            content: achievement
         });
      }
   }
   return filterItems;
}

const getUnlockedFilter = (): ReadonlyArray<FilterItem> => {
   // Create the dictionary of sorted achievements.
   const filteredAchievements = {
      "Unlocked": new Array<Achievement>(),
      "Locked": new Array<Achievement>()
   };
   for (const achievement of ACHIEVEMENTS) {
      filteredAchievements[achievement.isUnlocked ? "Unlocked" : "Locked"].push(achievement);
   }

   let filterItems = new Array<FilterItem>();
   for (const [filterCategory, achievements] of Object.entries(filteredAchievements)) {
      filterItems.push({
         type: "heading",
         content: filterCategory
      });

      for (const achievement of achievements) {
         filterItems.push({
            type: "achievement",
            content: achievement
         });
      }
   }
   return filterItems;
}

const filterToElems = (filterItems: ReadonlyArray<FilterItem>, displayType: DisplayTypes): ReadonlyArray<JSX.Element> => {
   let key = 0;
   let elems = new Array<JSX.Element>();

   let currentContainer = new Array<JSX.Element>();

   const createNewContainer = (): void => {
      let containerClassName = "achievement-container";
      for (const [display, displayName] of Object.entries(DisplayTypes)) {
         if (displayName === displayType) containerClassName += " " + display;
      }

      elems.push(
         <div key={key++} className={containerClassName}>
            {currentContainer}
         </div>
      );

      currentContainer = new Array<JSX.Element>();
   }

   for (let i = 0; i < filterItems.length; i++) {
      const item = filterItems[i];
      if (item.type === "heading") {
         if (i > 0) {
            createNewContainer();
         }

         elems.push(
            <h2 key={key++}>{item.content}</h2>
         );

      } else if (item.type === "achievement") {
         const achievement = item.content as Achievement;
         
         let achievementSrc;
         if (!achievement.isUnlocked) {
            achievementSrc = require("../../images/icons/questionmark.png").default;
         } else {
            try {
               achievementSrc = require("../../images/icons/" + achievement.iconSrc).default;
            } catch {
               achievementSrc = require("../../images/icons/questionmark.png").default;
            }
         }

         let className = "achievement";
         if (!achievement.isUnlocked) {
            className += " locked";
         }

         currentContainer.push(
            <div key={key++} className={className}>
               <img className="icon" src={achievementSrc} alt={achievement.name} />
               <div>
                  <p className="name">{achievement.isUnlocked ? achievement.name : "???"}</p>
                  <p className="description">{achievement.isUnlocked ? achievement.description : "???"}</p>
               </div>
            </div>
         );
      }
   }
   createNewContainer();

   return elems;
}

interface ElemProps {
   application: AchievementTracker;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.category);
   const [displayType, setDisplayType] = useState<DisplayTypes>(DisplayTypes.strips);

   let filterItems!: ReadonlyArray<FilterItem>;
   if (filterType === FilterTypes.category) {
      filterItems = getCategoryFilter();
   } else if (filterType === FilterTypes.unlocked) {
      filterItems = getUnlockedFilter();
   }

   const achievements = filterToElems(filterItems, displayType);

   // let achievements!: ReadonlyArray<JSX.Element>;
   // if (filterType === FilterTypes.category) {
   //    achievements = categoryFilter(displayType);
   // }

   const viewOptions = new Array<JSX.Element>();
   for (let i = 0; i < Object.keys(DisplayTypes).length; i++) {
      const displayName = Object.values(DisplayTypes)[i];
      const clickEvent = (): void => {
         setDisplayType(displayName);
      }

      let className = "display-type";
      if (displayName === displayType) className += " selected";

      viewOptions.push(
         <div className={className} onClick={clickEvent} key={i}>
            <div className="name">{displayName}</div>
         </div>
      )
   }

   const switchFilterType = (newFilterType: FilterTypes): void => {
      setFilterType(newFilterType);
   }

   const filterTypeButtons = Object.entries(FilterTypes).map(([id, name], i) => {
      return <Button onClick={() => switchFilterType(name)} isDark={name !== filterType} key={i}>{name}</Button>;
   });

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
         <div className="filter-container">
            {filterTypeButtons}
         </div>
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
   constructor(isUnlocked: boolean) {
      super({
         name: "Achievement Tracker",
         id: "achievementTracker",
         fileName: "achievement_tracker",
         category: ApplicationCategory.lifestyle,
         description: "Keep track of how many meaningless tasks you have completed.",
         iconSrc: "achievement-tracker.png",
         cost: 5,
         isUnlocked: isUnlocked
      });
   }

   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default AchievementTracker;