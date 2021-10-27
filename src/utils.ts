export function getElem(id: string): Element | undefined {
   const elem = document.getElementById(id);
   if (elem) return elem;
   return undefined;
}
export function roundNum(num: number, dpp: number): number {
   const power = Math.pow(10, dpp)
   return Math.round((num + Number.EPSILON) * power) / power;
}