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

export function roundNum(num: number, dpp: number): number {
   const power = Math.pow(10, dpp)
   return Math.round((num + Number.EPSILON) * power) / power;
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