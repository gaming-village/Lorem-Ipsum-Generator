import Game from "./Game";
import { getElem, updateProgressBar, wait } from "./utils";

export interface Job {
   name: string;
   salary: number;
   requirements: {
      lorem: number;
   }
   costs: {
      lorem: number;
      workforce: number;
   },
   loremProduction: number;
}

export const loremCorp = {
   workerNumber: 0 as number,
   jobs: [
      {
         name: "intern",
         salary: 0,
         costs: {
            lorem: 10,
            workforce: 1
         },
         loremProduction: 0.01
      },
      {
         name: "employee",
         salary: 1000,
         requirements: {
            lorem: 50
         },
         costs: {
            lorem: 50,
            workforce: 2
         },
         loremProduction: 10
      },
      {
         name: "manager",
         salary: 50000,
         requirements: {
            lorem: 500
         },
         costs: {
            lorem: 60,
            workforce: 3
         },
         loremProduction: 10
      },
      {
         name: "executive",
         salary: 1000000,
         requirements: {
            lorem: 5000
         },
         costs: {
            lorem: 70,
            workforce: 4
         },
         loremProduction: 100
      }
   ] as Job[],
   jobIndex: 0 as number,
   job: {} as Job,
   nextJob: {} as Job | null,
   jobListeners: [] as Function[],
   updateNextJob: function(): void {
      if (this.jobIndex + 1 >= this.jobs.length) this.nextJob = null;
      this.nextJob = this.jobs[this.jobIndex + 1];
   },
   addJobListener: function(func: Function): void {
      this.jobListeners.push(func);
   },
   updatePromotionProgress: function(): void {
      const progressBar = getElem("corporate-overview").querySelector(".home-panel .progress-bar-container") as HTMLElement;
      if (progressBar) {
         const progress = Game.lorem / (this.nextJob as Job).requirements.lorem * 100;
         updateProgressBar(progressBar, progress);
      }
   },
   workers: [] as number[],
   attemptToBuyWorker: function(worker: Job): void {
      const workerCount: number = this.workers[this.jobs.indexOf(worker)];
      const cost = this.getWorkerCost(worker, workerCount + 1);
      if (this.canAffordWorker(cost)) {
         this.buyWorker(worker, cost);
      }
   },
   getWorkerCost: function(worker: Job, n: number): number {
      // $ = b * 1.1^n + (b/10 * n)
      // Gets the cost of the n-th worker
      const baseCost = worker.costs.lorem;
      const cost = baseCost * Math.pow(1.1, n) + baseCost / 10 * n;
      return cost;
   },
   canAffordWorker: function(cost: number): boolean {
      return Game.lorem >= cost;
   },
   buyWorker: function(worker: Job, cost: number): void {
      this.workers[this.jobs.indexOf(worker)]++;
      Game.lorem -= cost;
      this.buyListeners[0]();
   },
   buyListeners: [] as Function[],
   addBuyListener: function(func: Function): void {
      this.buyListeners.push(func);
   },
   getWorkerCount: function(worker: Job): number {
      return this.workers[this.jobs.indexOf(worker)];
   },
   getTotalWorkerProduction: function(): number {
      let total: number = 0;
      for (const job of this.jobs) {
         total += this.getWorkerProduction(job);
      }
      return total;
   },
   getWorkerProduction: function(worker: Job): number {
      const workerCount = this.getWorkerCount(worker);
      if (workerCount === undefined) return 0;
      return workerCount * worker.loremProduction;
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
      this.job = (this.nextJob as Job);
      this.nextJob = this.jobs[this.jobIndex + 1];
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

   const homeButton: HTMLElement = (corporateOverview.querySelector(".home-button") as HTMLElement);
   homeButton.addEventListener("click", () => switchPanel("home-panel", homeButton));

   const upgradesButton: HTMLElement = (corporateOverview.querySelector(".upgrades-button") as HTMLElement);
   upgradesButton.addEventListener("click", () => switchPanel("upgrades-panel", upgradesButton));

   // Open the home panel by default
   switchPanel("home-panel", homeButton);

   loremCorp.setup();
}