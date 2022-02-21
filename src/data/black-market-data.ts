export interface BlackMarketShop {
   name: string;
   pageName: string;
   cost: number;
}
export const BLACK_MARKET_SHOPS: ReadonlyArray<BlackMarketShop> = [
   {
      name: "Malware",
      pageName: "malware",
      cost: 1
   }
];