import { dragElem, getElem } from "./utils";

export interface ApplicationInfo {
   name: string;
   description: string;
   type: string;
   cost: number;
   isDefault: boolean;
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
      cost: 0,
      isDefault: true,
      isUnlocked: true,
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
   for (const application of Object.values(applications)) {
      // Create the taskbar application references
      if (application.isUnlocked) {
         createApplicationTaskbarReference(application);
      }

      // Opens all previously opened applications
      if (application.isOpened) {
         openApplication(application);
      }

      // Drag functionality
      const element: HTMLElement = getElem(application.containerID);
      const titleBar: HTMLElement = (element.querySelector(".title-bar") as HTMLElement);
      dragElem(element, titleBar);
   }
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