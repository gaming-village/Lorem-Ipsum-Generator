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

*/

interface PrestigeUpgrade {
   readonly name: string;
   readonly description: string;
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

export const COMPANY_POLICIES: ReadonlyArray<PrestigeBundle> = [
   {
      baseCost: 10,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "The Eternal Ordeal",
         description: "Gain access to "
      },
      binary: {
         name: "",
         description: ""
      },
      origins: null,
      id: 1
   },
   {
      baseCost: 500,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: "Software Update 1",
         description: "Enhances your virtual machine's software to run on Windows 95."
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
         description: "Enhances your virtual machine's software to run on Windows XP."
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
         description: "Enhances your virtual machine's software to run on Windows 10."
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
         description: "Allows you to view prestige upgrades without having to prestige."
      },
      origins: [1],
      id: 5
   }
];