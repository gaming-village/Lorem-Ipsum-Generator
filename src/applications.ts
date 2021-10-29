import { dragElem, getElem } from "./utils";

interface Application {
   isOpened: boolean;
   isUnlocked: boolean;
   isDefaultApplication: boolean;
   name: string;
   containerID: string;
   taskbarReference?: Element;
}

export const applications = {
   loremCounter: {
      isOpened: true,
      isUnlocked: true,
      isDefaultApplication: true,
      name: "Lorem Counter",
      containerID: "lorem-counter"
   }
};

const createApplicationTaskbarReference = (application: Application) => {
   const reference = document.createElement("div");
   reference.className = "taskbar-application";
   console.log(reference);
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
export function openApplication(application: Application) {
   application.isOpened = true;
   application.taskbarReference?.classList.add("opened");
   getElem(application.containerID)?.classList.remove("hidden");
}
export function closeApplication(application: Application) {
   application.isOpened = false;
   application.taskbarReference?.classList.remove("opened");
   getElem(application.containerID)?.classList.add("hidden");
}