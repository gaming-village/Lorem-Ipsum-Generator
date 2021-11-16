import achievements, { Achievement } from "../data/achievements";
import { beautify, getElem } from "../utils";

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
]

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

      for (const segment of displayArray) {
         if (Array.isArray(segment)) {
            // Header
            const header = document.createElement(segment[0]);
            header.innerHTML = segment[1];
            container.appendChild(header);
         } else {
            // Achievement
            const achievement = achievementReferences[segment.id];
            container.appendChild(achievement);
         }
      }
   },
   getDisplayArray: function(type: string): Array<[string, string] | Achievement> {
      let displayArray: Array<[string, string] | Achievement> = [];

      switch (type) {
         case "default": {
            return achievements;
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
            break;
         }
         case "unlocked": {
            let filteredAchievements: { [key: string]: Array<Achievement> } = {
               locked: [] as Array<Achievement>,
               unlocked: [] as Array<Achievement>
            };

            for (const achievement of achievements) {
               // console.log(achievement.isUnlocked ? "unlocked" : "locked");
               filteredAchievements[achievement.isUnlocked ? "unlocked" : "locked"].push(achievement);
            }

            console.log(filteredAchievements);
            console.log(filteredAchievements.locked);

            if (filteredAchievements.unlocked.length === 0) {
               displayArray.push(["p", "You haven't unlocked any achievements yet. Come back when you have!"]);
            } else {
               displayArray.push(["h2", "Unlocked"]);
               displayArray = displayArray.concat(filteredAchievements.unlocked);
            }
            displayArray.push(["h2", "Locked"]);
            displayArray = displayArray.concat(filteredAchievements.locked);

            console.log(displayArray);

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
      if (filterOption.classList.contains("selected")) {
         filterOption.classList.remove("selected");
         const displayArray = this.getDisplayArray("default");
         this.displayAchievements(displayArray);
         return;
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
   setup: function() {
      // Create the achievements and display them.
      this.createAchievements();
      this.updateAchievements("normal");

      const displayArray = this.getDisplayArray("default");
      this.displayAchievements(displayArray);

      this.createFilterOptions();
   }
}

export default achievementTracker;