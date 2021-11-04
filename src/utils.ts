export function randInt(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min)) + min;
}

export function getElem(id: string): HTMLElement {
   const elem = document.getElementById(id);
   if (elem) return elem;
   throw new Error(`Element with the id of '${id}' does not exist!'`);
}
export function elemExists(id: string): boolean {
   const elem = document.getElementById(id);
   if (elem) return true;
   return false;
}

export function roundNum(num: number, dpp: number = 2): number {
   const power = Math.pow(10, dpp)
   return Math.round((num + Number.EPSILON) * power) / power;
}

export function beautify(input: string, count: number | undefined = undefined): string {
   let output: string = input;
   // Capitalise
   output = output[0].toUpperCase() + output.substring(1, output.length);

   if (count !== undefined && count !== 1) output += "s";

   return output;
}
export function getPrefix(input: string): string {
   const vowels: string[] = ["a", "e", "i", "o", "u"];
   const prefix = vowels.includes(input.split("")[0].toLowerCase()) ? "an" : "a";
   return prefix;
}

export function dragElem(element: HTMLElement, target: HTMLElement): void {
   let previousX: number = 0, previousY: number = 0

   target.addEventListener("mousedown", mouseDown);

   function mouseDown(event: MouseEvent): void {
      if (event.target !== target) return;

      previousX = event.clientX;
      previousY = event.clientY;

      target.addEventListener("mouseup", mouseUp);
      document.addEventListener("mousemove", drag);
   }

   function mouseUp(): void {
      target.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mousemove", drag);
   }

   function drag(event: MouseEvent): void {
      const changeInX: number = event.clientX - previousX,
      changeInY: number = event.clientY - previousY;

      element.style.left = element.offsetLeft + changeInX + "px"
      element.style.top = element.offsetTop + changeInY + "px"
      
      previousX = event.clientX;
      previousY = event.clientY;
   }
}

export function wait(delay: number) {
   return new Promise(resolve => setTimeout(resolve, delay));
}