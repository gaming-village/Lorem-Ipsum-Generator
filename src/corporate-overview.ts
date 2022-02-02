import WORKERS, { Worker } from "./data/workers";
import Game from "./Game";
import { hasUpgrade } from "./upgrades";
import { getElem, updateProgressBar, wait } from "./utils";

export const loremCorp = {
   workerNumber: 0 as number,
   jobIndex: 0 as number,
   job: {} as Worker,
   nextJob: {} as Worker | null,
   jobListeners: [] as Function[],
   updateCorporateOverview: undefined as unknown as Function,
   updateNextJob: function(): void {
      if (this.jobIndex + 1 >= WORKERS.length) this.nextJob = null;
      this.nextJob = WORKERS[this.jobIndex + 1];
   },
   addJobListener: function(func: Function): void {
      this.jobListeners.push(func);
   },
   updatePromotionProgress: function(): void {
      const progressBar = getElem("corporate-overview").querySelector(".home-panel .progress-bar-container") as HTMLElement;
      if (progressBar) {
         const progress = this.nextJob !== undefined ? Game.lorem / (this.nextJob as Worker).requirements.lorem * 100 : 100;
         updateProgressBar(progressBar, progress);
      }
   },
   workers: [] as number[],
   attemptToBuyWorker: function(worker: Worker): void {
      const workerCount: number = this.workers[WORKERS.indexOf(worker)];
      const cost = this.getWorkerCost(worker, workerCount + 1);
      if (this.canAffordWorker(cost)) {
         this.buyWorker(worker, cost);
      }
   },
   buyMaxWorkers: function(worker: Worker): void {
      let workerCount: number = this.getWorkerCount(worker);
      while (true) {
         const cost = this.getWorkerCost(worker, workerCount + 1);
         if (this.canAffordWorker(cost)) {
            this.buyWorker(worker, cost);
            workerCount++;
         } else {
            break;
         }
      }
   },
   getWorkerCost: function(worker: Worker, n: number): number {
      // $ = b * 1.1^n + (b/10 * n)
      // Gets the cost of the n-th worker
      const baseCost = worker.costs.lorem;
      const cost = baseCost * Math.pow(1.1, n) + baseCost / 10 * n;
      return cost;
   },
   canAffordWorker: function(cost: number): boolean {
      return Game.lorem >= cost;
   },
   buyWorker: function(worker: Worker, cost: number): void {
      this.workers[WORKERS.indexOf(worker)]++;
      Game.lorem -= cost;
      this.updateCorporateOverview();
   },
   getWorkerCount: function(worker: Worker): number {
      return this.workers[WORKERS.indexOf(worker)];
   },
   getTotalWorkerProduction: function(): number {
      let total: number = 0;
      for (const worker of WORKERS) {
         total += this.getWorkerProduction(worker);
      }
      return total;
   },
   getBaseWorkerProduction: function(worker: Worker): number {
      let baseWorkerProduction = worker.loremProduction;

      if (worker.name === "intern") {
         if (hasUpgrade("Disciplinary Techniques")) {
            let otherWorkerCount: number = 0;
            this.workers.forEach((count, i) => {
               const worker = WORKERS[i];
               if (worker.name !== "intern") otherWorkerCount += count;
            });
   
            baseWorkerProduction += 0.01 * otherWorkerCount;
         }
         
         if (hasUpgrade("Intern Motivation")) {
            baseWorkerProduction *= Game.motivation;
         }
      }

      if (hasUpgrade("Corporate Heirarchy")) {
         const workerIndex = WORKERS.indexOf(worker);
         // If the worker is not the final worker
         if (workerIndex < WORKERS.length - 1) {
            const superiorCount = this.getWorkerCount(WORKERS[workerIndex + 1]);
            baseWorkerProduction *= 1 + superiorCount * 0.1;
         }
      }

      return baseWorkerProduction;
   },
   getWorkerProduction: function(worker: Worker): number {
      const workerCount = this.getWorkerCount(worker);
      if (workerCount === undefined) return 0;

      const totalWorkerProduction: number = workerCount * this.getBaseWorkerProduction(worker);

      return totalWorkerProduction;
   },
   setup: function(): void {
      this.jobListeners[0]();
   },
   attemptToPromote: function(): void {
      if (this.canPromote()) {
         this.promote();
      }
   },
   canPromote: function(): boolean {
      if (this.nextJob === null) return false;
      return Game.lorem >= this.nextJob.requirements.lorem;
   },
   promote: function(): void {
      this.job = (this.nextJob as Worker);
      this.nextJob = WORKERS[this.jobIndex + 1];
      this.jobIndex++;
      this.updateNextJob();
      this.jobListeners[0]();
   }
};

export function switchJSXPanel(name: string): void {
   const button: HTMLElement = (getElem("corporate-overview").querySelector(`.${name}-button`) as HTMLElement);
   const panelName = `${name}-panel`;
   switchPanel(panelName, button);
}

const switchPanel = async (name: string, button: HTMLElement) => {
   const corporateOverview: HTMLElement = getElem("corporate-overview");

   const panel: HTMLElement = (corporateOverview.querySelector(`.${name}`) as HTMLElement);
   const previouslyShownPanel: HTMLElement = (corporateOverview.querySelector(".panel-container:not(.hidden)") as HTMLElement);
   const previouslySelectedButton: HTMLElement = (corporateOverview.querySelector(".left-bar .button:not(.dark)") as HTMLElement);

   panel.classList.remove("hidden");
   button.classList.remove("dark");

   // If no other panel was shown or the panel is already shown, die
   if (!previouslyShownPanel || panel === previouslyShownPanel) return;

   previouslySelectedButton.classList.add("dark");

   // Slide in animation

   const KEYFRAME_COUNT = 15;
   const MS_DELAY_INTERVAL = 10;
   const PX_SLIDE_AMOUNT = 30;

   panel.style.marginLeft = `calc(${-PX_SLIDE_AMOUNT * KEYFRAME_COUNT}px + 7.5rem + 13px)`;
   panel.style.opacity = "0";

   previouslyShownPanel.style.marginLeft = "calc(7.5rem + 13px)";
   previouslyShownPanel.style.opacity = "1";

   for (let i = 1; i <= KEYFRAME_COUNT; i++) {
      const maxSlideAmount = PX_SLIDE_AMOUNT * KEYFRAME_COUNT;
         const slideAmount = PX_SLIDE_AMOUNT * i * Math.pow(i / KEYFRAME_COUNT, 1.1);
   
         previouslyShownPanel.style.marginLeft = `calc(${slideAmount}px + 7.5rem + 13px)`;
         previouslyShownPanel.style.opacity = (1 - i / KEYFRAME_COUNT).toString();
         
         panel.style.marginLeft = `calc(${slideAmount - maxSlideAmount}px + 7.5rem + 13px)`;
         panel.style.opacity = (i / KEYFRAME_COUNT).toString();
   
         await wait(MS_DELAY_INTERVAL);
   }

   previouslyShownPanel.classList.add("hidden");
}

export function setupCorporateOverview(): void {
   const corporateOverview: HTMLElement = getElem("corporate-overview");

   const homeButton: HTMLElement = corporateOverview.querySelector(".home-button") as HTMLElement;
   homeButton.addEventListener("click", () => switchPanel("home-panel", homeButton));

   const upgradesButton: HTMLElement = corporateOverview.querySelector(".upgrades-button") as HTMLElement;
   upgradesButton.addEventListener("click", () => switchPanel("upgrades-panel", upgradesButton));

   const packsButton = corporateOverview.querySelector(".lorem-packs-shop-button") as HTMLElement;
   packsButton.addEventListener("click", () => switchPanel("lorem-packs-shop-panel", packsButton));

   const dictionaryButton = corporateOverview.querySelector(".dictionary-button") as HTMLElement;
   dictionaryButton.addEventListener("click", () => switchPanel("dictionary-panel", dictionaryButton));

   // Open the home panel by default
   switchPanel("home-panel", homeButton);

   loremCorp.setup();
}