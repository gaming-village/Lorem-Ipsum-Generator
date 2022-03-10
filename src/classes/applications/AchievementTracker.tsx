import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import { hasUpgrade } from '../../components/corporate-overview/CorporateOverview';
import ACHIEVEMENT_DATA, { AchievementInfo, AchievementCategory } from '../../data/achievement-data';
import Game from '../../Game';
import { createNotification } from '../../notifications';
import { roundNum } from '../../utils';
import Application from './Application';

let addAchievementToTracker: (achievement: AchievementInfo) => void;

export function updateInternMotivation(): void {
   // Get the number of unlocked achievment
   let unlockedAchievements = 0;
   for (const achievement of ACHIEVEMENT_DATA) {
      if (achievement.isUnlocked) {
         unlockedAchievements++;
      }
   }

   Game.misc.internMotivation = unlockedAchievements * 5;
}

const findAchievement = (name: string): AchievementInfo | null => {
   for (const achievement of ACHIEVEMENT_DATA) {
      if (achievement.name === name) return achievement;
   }
   return null;
}
export function unlockAchievement(name: string): void {
   const achievement = findAchievement(name);
   if (achievement === null) {
      throw new Error(`Couldn't find an achievement with a name of '${name}'!`);
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

   if (typeof addAchievementToTracker !== "undefined") {
      addAchievementToTracker(achievement);
   }

   updateInternMotivation();
}

enum FilterTypes {
   none = "None",
   category = "Category",
   unlocked = "Unlocked"
}
enum DisplayTypes {
   compact = "Compact",
   strips = "Strips"
}

interface FilterItem {
   type: "heading" | "achievement";
   content: AchievementInfo | string;
}

const getNoneFilter = (): ReadonlyArray<FilterItem> => {
   const filterItems = new Array<FilterItem>();
   for (const achievement of ACHIEVEMENT_DATA) {
      filterItems.push({
         type: "achievement",
         content: achievement
      });
   }
   return filterItems;
}

const getCategoryFilter = (): ReadonlyArray<FilterItem> => {
   // Create the dictionary of sorted achievements.
   const filteredAchievements: { [key: string]: Array<AchievementInfo> } = {};
   for (const categoryName of Object.values(AchievementCategory)) {
      filteredAchievements[categoryName] = new Array<AchievementInfo>();
   }
   for (const achievement of ACHIEVEMENT_DATA) {
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
      "Unlocked": new Array<AchievementInfo>(),
      "Locked": new Array<AchievementInfo>()
   };
   for (const achievement of ACHIEVEMENT_DATA) {
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
         const achievement = item.content as AchievementInfo;
         
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

/** Gets all unlocked achievements */
const getUnlockedAchievements = (): Array<AchievementInfo> => {
   const unlockedAchievements = new Array<AchievementInfo>();
   for (const achievement of ACHIEVEMENT_DATA) {
      if (achievement.isUnlocked) unlockedAchievements.push(achievement);
   }
   return unlockedAchievements;
}

interface ElemProps {
   application: AchievementTracker;
}
const Elem = ({ application }: ElemProps): JSX.Element => {
   const [unlockedAchievements, setUnlockedAchievements] = useState<Array<AchievementInfo>>(getUnlockedAchievements());
   const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.none);
   const [displayType, setDisplayType] = useState<DisplayTypes>(DisplayTypes.strips);

   useEffect(() => {
      addAchievementToTracker = (achievement: AchievementInfo): void => {
         const newUnlockedAchievements = unlockedAchievements.slice();
         newUnlockedAchievements.push(achievement);
         setUnlockedAchievements(newUnlockedAchievements);
      }
   }, [unlockedAchievements]);

   let filterItems!: ReadonlyArray<FilterItem>;
   switch (filterType) {
      case FilterTypes.none: {
         filterItems = getNoneFilter();
         break;
      }
      case FilterTypes.category: {
         filterItems = getCategoryFilter();
         break;
      }
      case FilterTypes.unlocked: {
         filterItems = getUnlockedFilter();
         break;
      }
   }

   const achievements = filterToElems(filterItems, displayType);

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
      );
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

         <p className="achievement-count">Achievements: {unlockedAchievements.length}/{ACHIEVEMENT_DATA.length} <i>({roundNum(unlockedAchievements.length / ACHIEVEMENT_DATA.length * 100)}%)</i></p>

         {hasUpgrade("Intern Motivation") ? (
            <p className="motivation" style={{marginTop: "1rem"}}>Intern motivation: {Game.misc.internMotivation}</p>
         ) : undefined}

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
   instantiate(): JSX.Element {
      return <Elem application={this} />;
   }
}

export default AchievementTracker;