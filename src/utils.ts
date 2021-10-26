export function getElem(id: string): Element {
   const elem = document.getElementById(id);
   if (elem) return elem;
   throw new Error(`Element '${id}' could not be found.`);
}
export function roundNum(num: number, dpp: number): number {
   const power = Math.pow(10, dpp)
   return Math.round((num + Number.EPSILON) * power) / power;
}