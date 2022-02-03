import { getElem } from "./utils";
import "./css/applications.css";

export interface ApplicationInfo {
   readonly name: string;
   readonly description: string;
   readonly type: string;
   readonly cost: number;
   readonly isDefault: boolean;
   isUnlocked: boolean;
   isOpened: boolean;
   containerID: string;
   taskbarReference?: Element;
}

export const applications = {
   loremCounter: {
      name: "Lorem Counter",
      description: "i count lorem",
      type: "lifestyle",
      cost: 0,
      isDefault: true,
      isUnlocked: true,
      isOpened: true,
      containerID: "lorem-counter"
   },
   achievementTracker: {
      name: "Achievement Tracker",
      description: "Achieve",
      type: "lifestyle",
      cost: 5,
      isDefault: false,
      isUnlocked: false,
      isOpened: false,
      containerID: "achievement-tracker"
   },
   internEnhancementProgram: {
      name: "Intern Enhancement Program",
      description: "intern",
      type: "utility",
      cost: 1000,
      isDefault: false,
      isUnlocked: false,
      isOpened: false,
      containerID: "intern-enhancement-program"
   }
};

const createApplicationTaskbarReference = (application: ApplicationInfo) => {
   const reference = document.createElement("div");
   reference.className = "taskbar-application";
   getElem("taskbar")?.appendChild(reference);

   // TODO: Image src
   reference.innerHTML = `
   <div class="img"></div>
   <p>${application.name}</p>`;

   application.taskbarReference = reference;

   reference.addEventListener("click", () => {
      application.isOpened ? closeApplication(application) : openApplication(application);
   });
}

export function setupApplications() {
   const fileNames: ReadonlyArray<string> = ["LoremCounter", "AchievementTracker"];
   const applications = fileNames.map(fileName => require("./classes/applications/" + fileName).default)

   for (const application of applications) {
      new application();
   }
   // Loop again once Game.applications is filled
   for (const application of applications) {
      if (application.setup) application.setup();
   }

   // for (const applicationInfo of Object.values(applications)) {
   //    try {
   //       const applicationScript = require(`./applications/${applicationInfo.containerID}`).default;

   //       if (applicationScript.hasOwnProperty("setup")) {
   //          applicationScript.setup();
   //       }
   //    } catch {}

   //    // Create the taskbar application references
   //    if (applicationInfo.isUnlocked) {
   //       createApplicationTaskbarReference(applicationInfo);
   //    }

   //    // Opens all previously opened applications
   //    if (applicationInfo.isOpened) {
   //       openApplication(applicationInfo);
   //    }

   //    // Drag functionality
   //    const application: HTMLElement = getElem(applicationInfo.containerID);
   //    const titleBar: HTMLElement = (application.querySelector(".title-bar") as HTMLElement);
   //    dragElem(application, titleBar);

   //    // Minimise button functionality
   //    const minimiseButton = application.querySelector(".ui-minimize");
   //    if (minimiseButton) minimiseButton.addEventListener("click", () => closeApplication(applicationInfo));
   // }
}
export function openApplication(application: ApplicationInfo) {
   application.isOpened = true;
   application.taskbarReference?.classList.add("opened");
   getElem(application.containerID)?.classList.remove("hidden");
}
export function closeApplication(application: ApplicationInfo) {
   application.isOpened = false;
   application.taskbarReference?.classList.remove("opened");
   getElem(application.containerID)?.classList.add("hidden");
}

export function unlockApplication(application: ApplicationInfo): void {
   createApplicationTaskbarReference(application);
}