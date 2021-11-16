interface AchievementRequirements {
   lorem?: number;
}

export interface Achievement {
   id: string;
   name: string;
   description: string;
   type: string;
   iconSrc: string;
   requirements: AchievementRequirements;
   isUnlocked?: boolean;
}

const achievements: Array<Achievement> = [
   {
      id: "SO_IT_BEGINS",
      name: "So it begins...",
      description: "Generate your first lorem.",
      type: "tiered",
      iconSrc: "picture.png",
      requirements: {
         lorem: 10
      }
   },
   {
      id: "GETTING_SOMEWHERE",
      name: "Getting somewhere",
      description: "Generate 1000 lorem.",
      type: "tiered",
      iconSrc: "save.png",
      requirements: {
         lorem: 1000
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

export default achievements;