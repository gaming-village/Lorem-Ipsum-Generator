/*

IDEAS/CONCEPTS PLACE

The user is able to prestige when 

Loyalty determines which policies you can see, and how much of each prestige currency you get
50% loyalty = 50% corporate tokens, 50% corrupted tokens
75% loyalty = 80% corporate 20% corrupted
25% loyalty = 20% corporate 80% corrupted

Prestige currency name: Corporate tokens, Corrupted tokens

Your accomplishments are converted into tokens
Base tokens comes from total lorem generated
Multiplied by:
- Workforce (number of workers)

First prestige upgrade:
- Company policy
- Description: "Unlocks legacy points. Each legacy point increases your lorem prodution by 1%."

*/

interface PrestigeUpgrade {
   readonly name: string;
   readonly description: string;
   readonly flavourText: string;
}

interface CompanyPolicyInfo extends PrestigeUpgrade {
}

interface BinaryInfo extends PrestigeUpgrade {

}

interface PrestigeBundle {
   readonly baseCost: number;
   readonly screenPosition: {
      readonly x: number;
      readonly y: number;
   }
   readonly companyPolicy?: CompanyPolicyInfo;
   readonly binary?: BinaryInfo;
   /** The id's of previous upgrades required to unlock the current one. */
   readonly origins: ReadonlyArray<number> | null;
   readonly id: number;
}

export const PRESTIGE_UPGRADES: ReadonlyArray<PrestigeBundle> = [
   {
      baseCost: 1,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "The Beginning",
         description: "Unlocks legacy points. Each legacy point increases your lorem prodution by 1%.",
         flavourText: "Your time has come."
      },
      origins: null,
      id: 1
   },
   {
      baseCost: 5,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "Advanced Accounting",
         description: "Gain various advanced options for purchasing workers.",
         flavourText: ""
      },
      origins: [1],
      id: 6
   },
   {
      baseCost: 500,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "Software Update 1",
         description: "Enhances your virtual machine's software to run on Windows 95.",
         flavourText: ""
      },
      origins: [1],
      id: 2
   },
   {
      baseCost: 1e5,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "Software Update 2",
         description: "Enhances your virtual machine's software to run on Windows XP.",
         flavourText: ""
      },
      origins: [2],
      id: 3
   },
   {
      baseCost: 1e8,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "Software Update 3",
         description: "Enhances your virtual machine's software to run on Windows 10.",
         flavourText: ""
      },
      origins: [3],
      id: 4
   },
   {
      baseCost: 100,
      screenPosition: {
         x: 0,
         y: 0
      },
      binary: {
         name: "Third Eye",
         description: "Allows you to view prestige upgrades without having to prestige.",
         flavourText: ""
      },
      origins: [1],
      id: 5
   },
   {
      baseCost: 1000,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "Mass Surveillance",
         description: "",
         flavourText: ""
      },
      binary: {
         name: "Civil Unrest",
         description: "",
         flavourText: "",
      },
      origins: [1],
      id: 7
   },
   {
      baseCost: 1000,
      screenPosition: {
         x: 0,
         y: 0
      },
      binary: {
         name: "Inside Connections",
         description: "",
         flavourText: ""
      },
      origins: [1],
      id: 8
   }
];