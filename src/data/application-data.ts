export enum ApplicationCategories {
   lifestyle = "Lifestyle",
   utility = "Utility"
}

export interface ApplicationInfo {
   name: string;
   /** The name of the file containing the application's class */
   className: string;
   /** The string used to access the application in Game's applications object */
   id: string;
   /** What the file's name is */
   fileName: string;
   category: ApplicationCategories;
   description: string;
   iconSrc: string;
   cost: number;
   isUnlocked?: boolean;
   isOpenByDefault?: true
}

const APPLICATION_DATA: ReadonlyArray<ApplicationInfo> = [
   {
      name: "Lorem Counter",
      className: "LoremCounter",
      id: "loremCounter",
      fileName: "lorem_counter",
      category: ApplicationCategories.lifestyle,
      description: "Counts your lorem.",
      iconSrc: "lorem-counter.png",
      cost: 0,
      isUnlocked: true,
      isOpenByDefault: true
   },
   {
      name: "Achievement Tracker",
      className: "AchievementTracker",
      id: "achievementTracker",
      fileName: "achievement_tracker",
      category: ApplicationCategories.lifestyle,
      description: "Keep track of how many meaningless tasks you have completed.",
      iconSrc: "achievement-tracker.png",
      cost: 5,
   },
   {
      name: "Big Lorem Counter",
      className: "BigLoremCounter",
      id: "bigLoremCounter",
      fileName: "big_lorem_counter",
      category: ApplicationCategories.lifestyle,
      description: "Counts your lorem. Bigger and better.",
      iconSrc: "lorem-counter.png",
      cost: 25,
   },
   {
      name: "Command Prompt",
      className: "CommandPrompt",
      id: "commandPrompt",
      fileName: "command_prompt",
      category: ApplicationCategories.utility,
      description: "Hackerman.",
      iconSrc: "lorem-counter.png",
      cost: 100
   }
];

export default APPLICATION_DATA;