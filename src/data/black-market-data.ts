export interface BlackMarketShop {
   name: string;
   description: string;
   pageName: string;
   cost: number;
   isUnlocked?: boolean;
}
export const BLACK_MARKET_SHOPS: ReadonlyArray<BlackMarketShop> = [
   {
      name: "Malware",
      description: "Purchase malware and popups to corrupt your device.",
      pageName: "malware",
      cost: 1
   }
];