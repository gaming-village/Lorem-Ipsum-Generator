import achievements, { Achievement } from "../data/achievements-data";
import { createNotification } from "../notifications";
import { beautify, getElem, roundNum } from "../utils";

interface AchievementReferences {
   [key: string]: HTMLElement;
}

let achievementReferences: AchievementReferences = {};

interface FilterOption {
   id: string,
   name: string
}

const filterOptions: Array<FilterOption> = [
   {
      id: "category",
      name: "Category"
   },
   {
      id: "search",
      name: "Search"
   },
   {
      id: "unlocked",
      name: "Unlocked"
   }
];

interface ViewOption {
   id: string,
   iconSrc: string,
   name: string
}

const viewOptions: Array<ViewOption> = [
   {
      id: "compact",
      iconSrc: "compact.png",
      name: "Compact"
   },
   {
      id: "strips",
      iconSrc: "strips.png",
      name: "Strips"
   }
];

const getAchievementCount = (): number => {
   let count = 0;
   for (const achievement of achievements) {
      if (achievement.isUnlocked) count++;
   }
   return count;
}
const updateAchievementCount = (): void => {
   const achievementCount = getAchievementCount();
   const progress = roundNum(achievementCount / achievements.length * 100);
   getElem("achievement-tracker").querySelector(".achievement-count")!.innerHTML = `Achievements: ${achievementCount}/${achievements.length} <i>(${progress}%)</i>`;
}

const findAchievement = (name: string): Achievement | null => {
   for (const achievement of achievements) {
      if (achievement.id === name) return achievement;
   }
   return null;
}
export function unlockAchievement(name: string): void {
   const achievement = findAchievement(name);
   if (achievement === null) {
      console.warn(`An achievement with an ID of '${name}' does not exist!`);
      return;
   }

   achievement.isUnlocked = true;
   achievementTracker.updateAchievements("normal");

   const notificationInfo = {
      iconSrc: "settings.png",
      title: achievement.name,
      description: achievement.description,
      caption: "New achievement!"
   };
   createNotification(notificationInfo, false, true);
}

const achievementTracker = {
   getAchievementContainer: function(): HTMLElement {
      return getElem("achievement-tracker").querySelector(".achievement-container") as HTMLElement;
   },
   clearDisplay: function(): void {
      this.getAchievementContainer().innerHTML = "";
   },
   displayAchievements: function(displayArray: Array<[string, string] | Achievement>) {
      // Clear the achievement container of any previous headings and achievements.
      this.clearDisplay();

      const container = this.getAchievementContainer();

      let currentAchievementFormatter: HTMLElement;
      displayArray.forEach((segment, i) => {

         const nextSegment = displayArray[i + 1];
         if (Array.isArray(segment)) {
            // Header
            const header = document.createElement(segment[0]);
            header.innerHTML = segment[1];
            container.appendChild(header);

            if (!Array.isArray(nextSegment)) {
               currentAchievementFormatter = document.createElement("div");
               currentAchievementFormatter.className = "achievement-formatter";
               container.appendChild(currentAchievementFormatter);
            }
         } else {
            // If it doesn't begin with text
            if (i === 0) {
               currentAchievementFormatter = document.createElement("div");
               currentAchievementFormatter.className = "achievement-formatter";
               container.appendChild(currentAchievementFormatter);
            }

            // Achievement
            const achievement = achievementReferences[segment.id];
            currentAchievementFormatter.appendChild(achievement);
         }
      });
   },
   getDisplayArray: function(type: string): Array<[string, string] | Achievement> {
      let displayArray: Array<[string, string] | Achievement> = [];

      switch (type) {
         case "default": {
            return achievements.slice();
         }
         case "category": {
            const filteredAchievements: { [key: string]: Array<Achievement> } = {};

            for (const achievement of achievements) {
               if (!filteredAchievements.hasOwnProperty(achievement.type)) {
                  filteredAchievements[achievement.type] = [ achievement ];
               } else {
                  filteredAchievements[achievement.type].push(achievement);
               }
            }

            for (const achievementType of Object.entries(filteredAchievements)) {
               displayArray.push(["h2", beautify(achievementType[0])]);

               for (const achievement of achievementType[1]) {
                  displayArray.push(achievement);
               }
            }

            break;
         }
         case "search": {
            return this.getDisplayArray("default");
         }
         case "unlocked": {
            let filteredAchievements: { [key: string]: Array<Achievement> } = {
               locked: [] as Array<Achievement>,
               unlocked: [] as Array<Achievement>
            };

            for (const achievement of achievements) {
               filteredAchievements[achievement.isUnlocked ? "unlocked" : "locked"].push(achievement);
            }

            if (filteredAchievements.unlocked.length === 0) {
               displayArray.push(["p", "You haven't unlocked any achievements yet. Come back when you have!"]);
            } else {
               displayArray.push(["h2", "Unlocked"]);
               displayArray = displayArray.concat(filteredAchievements.unlocked);
            }

            if (filteredAchievements.locked.length === 0) {
               displayArray.push(["p", "There are no achievements left to unlock... it's probably time to stop playing now."]);
            } else {
               displayArray.push(["h2", "Locked"]);
               displayArray = displayArray.concat(filteredAchievements.locked);
            }

            break;
         }
         default: {
            console.warn(`Unknown display type '${type}'. Reverting to default display array`);
            return this.getDisplayArray("default");
         }
      }

      return displayArray;
   },
   updateAchievements: function(displayType: "compact" | "normal") {
      for (const info of achievements) {
         const achievement = achievementReferences[info.id];
         
         switch (displayType) {
            case "normal": {
               achievement.innerHTML = `
               <div class="icon"></div>
               <div class="content">
                  <p class="name">${info.isUnlocked ? info.name : "???"}</p>
                  <p class="description">${info.isUnlocked ? info.description : "???"}</p>
               </div>`;
               achievement.className = `achievement${!info.isUnlocked ? " locked" : ""}`;

               break;
            }
            case "compact": {
               achievement.innerHTML = `
               <div class="icon"></div>`;

               // TODO: Create a tooltip showing the name and description on hover.

               break;
            }
         }

         let iconSrc: string;
         if (!info.isUnlocked) iconSrc = require("../images/icons/questionmark.png").default;
         else try {
            iconSrc = require(`../images/icons/${info.iconSrc}`).default;
         } catch {
            iconSrc = require("../images/icons/questionmark.png").default;
         }

         (achievement.querySelector(".icon") as HTMLElement).style.backgroundImage = `url("${iconSrc}")`;
      }

      updateAchievementCount();
   },
   createAchievement: function(info: Achievement) {
      const achievement = document.createElement("div");
      achievement.className = "achievement";
      
      achievementReferences[info.id] = achievement;
   },
   createAchievements: function() {
      for (const achievementInfo of achievements) {
         this.createAchievement(achievementInfo);
      }
   },
   selectFilterOption: function(info: FilterOption, filterOption: HTMLElement): void {
      const searchField = getElem("achievement-tracker").querySelector(".search-achievements") as HTMLInputElement;

      if (filterOption.classList.contains("selected")) {
         filterOption.classList.remove("selected");
         searchField.classList.add("hidden");

         const displayArray = this.getDisplayArray("default");
         this.displayAchievements(displayArray);

         return;
      }

      if (info.id === "search") {
         searchField.classList.remove("hidden");
         searchField.value = "";
      } else {
         searchField.classList.add("hidden");
      }

      const displayArray = this.getDisplayArray(info.id);
      this.displayAchievements(displayArray);

      const previouslySelectedFilterOption = getElem("achievement-tracker").querySelector(".filter-container .selected");
      if (previouslySelectedFilterOption) previouslySelectedFilterOption.classList.remove("selected");
      filterOption.classList.add("selected");
   },
   createFilterOptions: function(): void {
      const container = getElem("achievement-tracker").querySelector(".filter-container") as HTMLElement;
      for (const info of filterOptions) {
         const filterOption = document.createElement("p");
         filterOption.className = "filter-option";
         container.appendChild(filterOption);

         filterOption.innerHTML = info.name;

         filterOption.addEventListener("click", () => this.selectFilterOption(info, filterOption));
      }
   },
   selectViewOption: function(viewOptionInfo: ViewOption, viewOption: HTMLElement): void {
      if (viewOption.classList.contains("selected")) return;

      const previouslySelectedViewOption = getElem("achievement-tracker").querySelector(".view-option.selected");
      if (previouslySelectedViewOption) previouslySelectedViewOption.classList.remove("selected");
      viewOption.classList.add("selected");

      const achievementContainer = getElem("achievement-tracker").querySelector(".achievement-container")!;
      for (const viewOption of viewOptions) {
         achievementContainer.classList.remove(viewOption.id);
      }
      achievementContainer.classList.add(viewOptionInfo.id);
   },
   createViewOptions: function(): void {
      const DEFAULT_VIEW_OPTION = "strips";

      const container = getElem("achievement-tracker").querySelector(".view-options-container")!;
      for (const viewOptionInfo of viewOptions) {
         const viewOption = document.createElement("div");
         viewOption.className = `view-option${viewOptionInfo.id === DEFAULT_VIEW_OPTION ? " selected" : ""}`;
         container.appendChild(viewOption);

         const iconSrc = require(`../images/miscellaneous/thumbnail-${viewOptionInfo.iconSrc}`).default;

         viewOption.innerHTML = `
         <div class="display-name">${viewOptionInfo.name}</div>
         <img src="${iconSrc}" />`;

         viewOption.addEventListener("click", () => this.selectViewOption(viewOptionInfo, viewOption));
      }
   },
   setupSearchInput: function(): void {
      const searchField = getElem("achievement-tracker").querySelector(".search-achievements") as HTMLInputElement;

      searchField.addEventListener("input", () => {
         const value = searchField.value.toLowerCase();

         const displayArray = achievements.filter(achievement => {
            return achievement.name.toLowerCase().includes(value) || achievement.description.toLowerCase().includes(value);
         });
         this.displayAchievements(displayArray);
      });
   },
   setup: function(): void {
      // Create the achievements and display them.
      this.createAchievements();
      this.updateAchievements("normal");

      const displayArray = this.getDisplayArray("default");
      this.displayAchievements(displayArray);

      this.createFilterOptions();
      this.createViewOptions();

      this.setupSearchInput();

      updateAchievementCount();
   }
}

export default achievementTracker;