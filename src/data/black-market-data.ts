export interface BlackMarketShop {
   readonly name: string;
   readonly description: string;
   readonly pageName: string;
   readonly cost: number;
   isUnlocked?: boolean;
   /** The shop's unique identifier. Doesn't need to be in any pattern or order, just needs to be unique for every shop */
   readonly id: number;
}
export const BLACK_MARKET_SHOPS: ReadonlyArray<BlackMarketShop> = [
   {
      name: "Malware",
      description: "Purchase malware and popups to corrupt your device.",
      pageName: "malware",
      cost: 7.5,
      id: 1
   }
];