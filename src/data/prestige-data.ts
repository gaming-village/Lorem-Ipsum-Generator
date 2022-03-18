/*

IDEAS/CONCEPTS PLACE

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
}

interface CompanyPolicyInfo extends PrestigeUpgrade {
}

interface BinaryInfo extends PrestigeUpgrade {

}

interface PrestigeBundle {
   readonly baseUpgradeCost: number;
   readonly screenPosition: {
      readonly x: number;
      readonly y: number;
   }
   readonly companyPolicy?: CompanyPolicyInfo;
   readonly binary?: BinaryInfo;
}

export const COMPANY_POLICIES: ReadonlyArray<PrestigeBundle> = [
   {
      baseUpgradeCost: 10,
      screenPosition: {
         x: 0,
         y: 0
      },
      companyPolicy: {
         name: ""
      },
      binary: {
         name: ""
      }
   }
];