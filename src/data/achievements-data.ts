interface AchievementRequirements {
   readonly lorem?: number;
   readonly applications?: number;
}

export interface Achievement {
   readonly id: string;
   readonly name: string;
   readonly description: string;
   readonly type: string;
   readonly iconSrc: string;
   readonly requirements: AchievementRequirements;
   isUnlocked?: boolean;
}

const ACHIEVEMENTS: ReadonlyArray<Achievement> = [
   {
      id: "SO_IT_BEGINS",
      name: "So it begins...",
      description: "Generate your first lorem.",
      type: "tiered",
      iconSrc: "picture.png",
      requirements: {
         lorem: 1
      }
   },
   {
      id: "GETTING_SOMEWHERE",
      name: "Getting somewhere",
      description: "Generate 100 lorem.",
      type: "tiered",
      iconSrc: "save.png",
      requirements: {
         lorem: 100
      }
   },
   {
      id: "MICRO_TRANSACTIONS",
      name: "Micro Transactions",
      description: "Buy your first application.",
      type: "tiered",
      iconSrc: "save.png",
      requirements: {
         applications: 1
      }
   },
   {
      id: "FOOLS_GOLD",
      name: "Fool's Gold",
      description: "do something",
      type: "challenge",
      iconSrc: "",
      requirements: {}
   },
   {
      id: "SHADY_SALES",
      name: "Shady Sales",
      description: "Unlock the black market.",
      type: "challenge",
      iconSrc: "white-letter.png",
      requirements: {}
   }
];

export default ACHIEVEMENTS;