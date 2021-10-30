import { getElem, wait } from "./utils";

export const loremCorp = {
   job: "intern" as string,
   allJobs: ["intern", "employee", "manager", "executive"] as string[],
   setup: function(): void {

   }
};

const switchPanel = async (name: string, button: HTMLElement) => {
   const corporateOverview: HTMLElement = getElem("corporate-overview");

   const panel: HTMLElement = (corporateOverview.querySelector(`.${name}`) as HTMLElement);
   const previouslyShownPanel: HTMLElement = (corporateOverview.querySelector(".panel-container:not(.hidden)") as HTMLElement);
   const previouslySelectedButton: HTMLElement = (corporateOverview.querySelector(".left-bar .button:not(.dark)") as HTMLElement);

   panel.classList.remove("hidden");
   button.classList.remove("dark");

   console.log(panel);
   console.log(previouslyShownPanel);

   // If no other panel was shown or the panel is already shown, die
   if (!previouslyShownPanel || panel === previouslyShownPanel) return;

   previouslySelectedButton.classList.add("dark");

   // Slide in animation

   const KEYFRAME_COUNT = 15;
   const MS_DELAY_INTERVAL = 10;
   const PX_SLIDE_AMOUNT = 30;

   panel.style.marginLeft = `calc(${-PX_SLIDE_AMOUNT * KEYFRAME_COUNT}px + 7.5rem + 13px)`;
   panel.style.opacity = "0";

   previouslyShownPanel.style.marginLeft = "calc( + 7.5rem + 13px)";
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

   // for (let i = 1; i <= KEYFRAME_COUNT; i++) {
   //    const maxSlideAmount = PX_SLIDE_AMOUNT * KEYFRAME_COUNT;
   //    const slideAmount = PX_SLIDE_AMOUNT * i * Math.pow(i / KEYFRAME_COUNT, 1.1);

   //    console.log(i / KEYFRAME_COUNT);
   //    previouslyShownPanel.style.marginLeft = `${slideAmount}px`;
   //    previouslyShownPanel.style.opacity = (1 - i / KEYFRAME_COUNT).toString();
      
   //    panel.style.marginLeft = `${slideAmount - maxSlideAmount}px`;
   //    panel.style.opacity = (i / KEYFRAME_COUNT).toString();

   //    await wait(MS_DELAY_INTERVAL);
   // }

   console.log("hidden");
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