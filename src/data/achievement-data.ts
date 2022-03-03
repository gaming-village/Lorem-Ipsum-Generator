export enum AchievementCategory {
   challenge = "Challenge",
   tiered = "Tiered"
}

interface AchievementRequirements {
   readonly lorem?: number;
   readonly applications?: number;
}
export interface Achievement {
   readonly id: string;
   readonly name: string;
   readonly description: string;
   readonly category: AchievementCategory;
   readonly iconSrc: string;
   readonly requirements: AchievementRequirements;
   isUnlocked?: boolean;
}

const ACHIEVEMENTS: ReadonlyArray<Achievement> = [
   {
      id: "SO_IT_BEGINS",
      name: "So it begins...",
      description: "Generate your first lorem.",
      category: AchievementCategory.tiered,
      iconSrc: "picture.png",
      requirements: {
         lorem: 1
      }
   },
   {
      id: "GETTING_SOMEWHERE",
      name: "Getting somewhere",
      description: "Generate 100 lorem.",
      category: AchievementCategory.tiered,
      iconSrc: "save.png",
      requirements: {
         lorem: 100
      }
   },
   {
      id: "MICRO_MANAGEMENT",
      name: "Micro Management",
      description: "Generate 10000 lorem.",
      category: AchievementCategory.tiered,
      iconSrc: "save.png",
      requirements: {
         lorem: 10000
      }
   },
   {
      id: "MICRO_TRANSACTIONS",
      name: "Micro Transactions",
      description: "Buy your first application.",
      category: AchievementCategory.tiered,
      iconSrc: "save.png",
      requirements: {
         applications: 1
      }
   },
   {
      id: "FOOLS_GOLD",
      name: "Fool's Gold",
      description: "do something",
      category: AchievementCategory.challenge,
      iconSrc: "",
      requirements: {}
   },
   {
      id: "SHADY_SALES",
      name: "Shady Sales",
      description: "Unlock the black market.",
      category: AchievementCategory.challenge,
      iconSrc: "white-letter.png",
      requirements: {}
   }
];

export default ACHIEVEMENTS;