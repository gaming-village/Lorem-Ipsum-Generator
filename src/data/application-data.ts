export enum ApplicationCategories {
   lifestyle = "Lifestyle",
   utility = "Utility"
}

export interface ApplicationInfo {
   readonly name: string;
   /** The name of the file containing the application's class. Also used to access the application in Game's applications object */
   readonly className: string;
   /** What the file's name is */
   readonly fileName: string;
   readonly category: ApplicationCategories;
   readonly description: string;
   readonly iconSrc: string;
   readonly cost: number;
   isUnlocked?: boolean;
   readonly isOpenByDefault?: true
   /** Used to distinguish between unlocked applications in the save-data.ts file. Must be unique for every application. Doesn't have to follow any pattern. */
   readonly id: number;
}

const APPLICATION_DATA: ReadonlyArray<ApplicationInfo> = [
   {
      name: "Lorem Counter",
      className: "LoremCounter",
      fileName: "lorem_counter",
      category: ApplicationCategories.lifestyle,
      description: "Counts your lorem.",
      iconSrc: "lorem-counter.png",
      cost: 0,
      isUnlocked: true,
      isOpenByDefault: true,
      id: 1
   },
   {
      name: "Achievement Tracker",
      className: "AchievementTracker",
      fileName: "achievement_tracker",
      category: ApplicationCategories.lifestyle,
      description: "Keep track of how many meaningless tasks you have completed.",
      iconSrc: "achievement-tracker.png",
      cost: 5,
      id: 2
   },
   {
      name: "Big Lorem Counter",
      className: "BigLoremCounter",
      fileName: "big_lorem_counter",
      category: ApplicationCategories.lifestyle,
      description: "Counts your lorem. Bigger and better.",
      iconSrc: "lorem-counter.png",
      cost: 25,
      id: 3
   },
   {
      name: "Command Prompt",
      className: "CommandPrompt",
      fileName: "command_prompt",
      category: ApplicationCategories.utility,
      description: "Hackerman.",
      iconSrc: "lorem-counter.png",
      cost: 100,
      id: 4
   }
];

export default APPLICATION_DATA;