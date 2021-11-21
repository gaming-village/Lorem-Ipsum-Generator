export function randInt(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min)) + min;
}

export function randItem(arr: Array<any> | ReadonlyArray<any>): any {
   const itemIndex = randInt(0, arr.length);
   return arr[itemIndex];
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

export function hashCode(str: string): number {
   // Yoinked from here:
   // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
   
   let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;

        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export function capitalise(input: string): string {
   return input[0].toUpperCase() + input.substring(1, input.length);
}

export function beautify(input: string, count: number | undefined = undefined): string {
   // Capitalise
   let output: string = capitalise(input);

   // Make plural
   if (count !== undefined && count !== 1) output += "s";

   return output;
}
export function getPrefix(input: string): string {
   const vowels: string[] = ["a", "e", "i", "o", "u"];
   const prefix = vowels.includes(input.split("")[0].toLowerCase()) ? "an" : "a";
   return prefix;
}

export function getCurrentTime(): number {
   const time = new Date().getTime();
   return time;
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

interface Position {
   x: number;
   y: number;
}

function radiansBetweenPoints(startPos: Position, endPos: Position): number {
   const changeInY = endPos.y - startPos.y;
   const changeInX = endPos.x - startPos.x;
   const theta = Math.atan2(changeInY, changeInX);
   return theta;
}

export function createLineTrail(container: HTMLElement, startPos: Position, endPos: Position): void {
   const trail = document.createElement("div");
   trail.classList.add("line-trail");
   container.appendChild(trail);

   const trailLength = Math.sqrt(Math.pow(startPos.x - endPos.x, 2) + Math.pow(startPos.y - endPos.y, 2));
   trail.style.width = `${trailLength}px`;

   const rotation = radiansBetweenPoints(startPos, endPos);
   trail.style.transform = `rotate(${rotation}rad)`;

   trail.style.left = `${startPos.x}px`;
   trail.style.top = `${startPos.y}px`;
}

export function updateProgressBar(progressBarContainer: HTMLElement, progress: number): void {
   const progressBar: HTMLElement = progressBarContainer.querySelector(".progress-bar") as HTMLElement;
   progressBar.style.width = `${progress}%`;

   const label = progressBarContainer.querySelector(".label") as HTMLElement;
   label.innerHTML = `${roundNum(Math.min(progress, 100))}%`;
   label.style.left = `${Math.min(progress, 100)}%`;
}