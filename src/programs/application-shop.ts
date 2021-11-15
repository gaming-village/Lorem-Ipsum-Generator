import { ApplicationInfo, applications } from "../applications";
import { beautify, getElem } from "../utils";

interface CategoryTypes {
   [key: string]: any;
}

interface ApplicationReferences {
   [key: string]: HTMLElement;
}

const applicationShop = {
   elementID: "application-shop" as string,
   applicationReferences: {} as ApplicationReferences,
   createCategories: function(): {} {
      const categories = ["lifestyle", "utility"];
      let categoryContainers = {} as CategoryTypes;

      for (const categoryName of categories) {
         const container = document.createElement("div");
         container.className = "category";

         const header = document.createElement("h2");
         header.innerHTML = beautify(categoryName);
         container.appendChild(header);

         categoryContainers[categoryName] = container;
         getElem(this.elementID).appendChild(container);
      }

      return categoryContainers;
   },
   createApplication: function(info: ApplicationInfo, container: HTMLElement) {
      const application = document.createElement("div");
      application.className = "application";
      container.appendChild(application);

      application.innerHTML = `
      <p class="name">${info.name}</p>
      <p class="description">${info.description}</p>
      <button class="button">${info.cost}</button>`;

      this.applicationReferences[info.name] = application;
   },
   createApplications: function(applicationCategories: CategoryTypes) {
      for (const applicationInfo of Object.values(applications)) {
         const category = applicationCategories[applicationInfo.type];
         this.createApplication(applicationInfo, category);
      }
   },
   setup: function(): void {
      const applicationCategories = this.createCategories();
      this.createApplications(applicationCategories);

      this.updateAllShopReferences();
   },
   updateApplication: function(info: ApplicationInfo): void {
      const shopReference = this.applicationReferences[info.name];

      const buyButton = shopReference.querySelector("button") as HTMLElement;
      if (info.isUnlocked) {
         shopReference.classList.add("unlocked");
         buyButton.innerHTML = "Owned";
         buyButton.classList.add("dark");
      } else {
         shopReference.classList.remove("unlocked");
         buyButton.innerHTML = info.cost.toString();
         buyButton.classList.remove("dark");
      }
   },
   updateAllShopReferences: function(): void {
      for (const applicationInfo of Object.values(applications)) {
         this.updateApplication(applicationInfo);
      }
   }
};

export default applicationShop;