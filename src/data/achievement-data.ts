export enum AchievementCategory {
   challenge = "Challenge",
   tiered = "Tiered"
}

interface AchievementRequirements {
   readonly lorem?: number;
   readonly applications?: number;
   readonly totalWorkerCount?: number;
   readonly workers?: {
      // tier: workerCount
      [key: number]: number;
   }
}
export interface AchievementInfo {
   readonly name: string;
   readonly description: string;
   readonly category: AchievementCategory;
   readonly iconSrc: string;
   readonly requirements?: AchievementRequirements;
   /** The achievement's unique identifier. Doesn't need to be in any pattern or order, just needs to be unique for every achievement */
   readonly id: number;
   isUnlocked?: boolean;
}

const ACHIEVEMENT_DATA: ReadonlyArray<AchievementInfo> = [
   {
      name: "So it begins...",
      description: "Generate your first lorem.",
      category: AchievementCategory.tiered,
      iconSrc: "picture.png",
      requirements: {
         lorem: 1
      },
      id: 1
   },
   {
      name: "Getting somewhere",
      description: "Generate 100 lorem.",
      category: AchievementCategory.tiered,
      iconSrc: "save.png",
      requirements: {
         lorem: 100
      },
      id: 2
   },
   {
      name: "Micro Management",
      description: "Generate 10000 lorem.",
      category: AchievementCategory.tiered,
      iconSrc: "save.png",
      requirements: {
         lorem: 10000
      },
      id: 3
   },
   {
      name: "Micro Transactions",
      description: "Buy your first application.",
      category: AchievementCategory.tiered,
      iconSrc: "save.png",
      requirements: {
         applications: 1
      },
      id: 4
   },
   {
      name: "Fool's Gold",
      description: "do something",
      category: AchievementCategory.challenge,
      iconSrc: "",
      id: 5
   },
   {
      name: "Shady Sales",
      description: "Unlock the black market.",
      category: AchievementCategory.challenge,
      iconSrc: "white-letter.png",
      id: 6
   }
];

export default ACHIEVEMENT_DATA;