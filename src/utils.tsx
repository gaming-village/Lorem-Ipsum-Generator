export class Point {
   x: number;
   y: number;
   constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
   }

   add(point2: Point): Point {
      return new Point(
         this.x + point2.x,
         this.y + point2.y
      );
   }

   multiply(amount: number): Point {
      return new Point(
         this.x * amount,
         this.y * amount
      );
   }
}

export class Vector {
   magnitude: number;
   direction: number;

   private _x: number;
   private _y: number;

   get x(): number {
      return this._x;
   }
   set x(newVal: number) {
      this._x = newVal;
      this.updateVectorVals();
   }

   get y(): number {
      return this._y;
   }
   set y(newVal: number) {
      this._y = newVal;
      this.updateVectorVals();
   }

   constructor(magnitude: number, direction: number) {
      this.magnitude = magnitude;
      this.direction = direction;

      this._x = Math.sin(this.direction) * this.magnitude;
      this._y = Math.cos(this.direction) * this.magnitude;
   }

   private updateVectorVals(): void {
      const magnitude = Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
      const direction = Math.atan2(this._y, this._x) * 180/Math.PI;

      this.magnitude = magnitude;
      this.direction = direction;
   }

   convertToPoint(): Point {
      return new Point(this._x, this._y);
   }

   static randomUnit(): Vector {
      const magnitude = 1;
      const direction = randFloat(0, 360);
      return new Vector(magnitude, direction);
   }
}

export class CustomAudio {
   private context!: AudioContext;

   constructor(name: string) {
      try {
         this.context = new AudioContext();
      } catch {
         alert("Web Audio API is not supported in your browser!");
      }

      const path = require("./audio/" + name).default;
      const audio = new Audio(path);

      const source = this.context.createMediaElementSource(audio);
      source.connect(this.context.destination);

      this.context.resume();
      audio.play();

      audio.addEventListener("ended", () => this.remove(source, audio));
   }

   private remove(source: MediaElementAudioSourceNode, audio: HTMLAudioElement): void {
      source.disconnect();
      audio.remove();
      this.context.close();
   }
}

export class CustomSound {
   private context: AudioContext;

   constructor() {
      this.context = new AudioContext();
      this.context.resume();

      const oscillator = this.context.createOscillator();
      oscillator.connect(this.context.destination);
      oscillator.start();
   }
}

export function randInt(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min)) + min;
}

export function randFloat(min: number, max: number): number {
   return Math.random() * (max - min) + min;
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

export function roundNum(num: number, dpp: number = 2, showDecimalPlaces: boolean = false): string {
   const power = Math.pow(10, dpp)
   const roundedNum = Math.round((num + Number.EPSILON) * power) / power;

   if (showDecimalPlaces) {
      if (!Number.isInteger(roundedNum)) {
         const numDecimalPlaces = dpp - roundedNum.toString().split(".")[1].length;
         
         return roundedNum + "0".repeat(numDecimalPlaces);
      } else {
         return roundedNum + "." + "0".repeat(dpp);
      }
   }
   return roundedNum.toString();
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

export function clamp(value: number, min: number, max: number): number {
   return Math.max(Math.min(value, max), min);
}

export function isPrime(num: number): boolean {
   if (num < 2) return false;

   for (let i = 2; i <= Math.sqrt(num); i++) {
      if (Number.isInteger(num / i)) return false;
   }
   return true;
}

export function shuffleArr(arr: Array<any>): Array<any> {
   // Yoinked from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

   let currentIndex = arr.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }

  return arr;
}