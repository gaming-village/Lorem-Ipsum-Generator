import { getElem } from "../utils";

interface BackgroundInfo {
   content: string;
   type: string;
   name: string;
   isTileable?: boolean;
}

const preferences = {
   elementID: "preferences" as string,
   currentBackgroundIndexes: [0, 0] as number[],
   backgrounds: {
      "computer": [
         {
            content: "#008080",
            type: "colour",
            name: "95 Green"
         },
         {
            content: "bliss.jpeg",
            type: "image",
            name: "Bliss",
            isTileable: false
         },
         {
            content: "honeycomb.jpeg",
            type: "image",
            name: "Honeycomb",
            isTileable: true
         },
         {
            content: "garden.png",
            type: "image",
            name: "Garden",
            isTileable: true
         }
      ] as BackgroundInfo[],
      "mail": [
         {
            content: "straws.png",
            type: "image",
            name: "Straws",
            isTileable: true
         },
         {
            content: "tiles.png",
            type: "image",
            name: "Tiles",
            isTileable: true
         }
      ] as BackgroundInfo[],
      "corporate-overview": [
         {
            content: "carved-stone.png",
            type: "image",
            name: "Carved Stone",
            isTileable: true
         },
         {
            content: "triangles.png",
            type: "image",
            name: "Garden",
            isTileable: true
         }
      ] as BackgroundInfo[]
   },
   setup: function(): void {
      // Show the current background image
      this.updateBackgrounds();
 
      this.createBackgroundThumbnails();
   },
   createBackgroundThumbnails: function(): void {
      for (let i = 0; i < Object.keys(this.backgrounds).length; i++) {
         const backgroundType = Object.keys(this.backgrounds)[i];
         const thumbnailContainer = getElem(this.elementID)?.querySelector(`.${backgroundType}-thumbnail-container`);
         for (let k = 0; k < Object.values(this.backgrounds)[i].length; k++) {
            const background = Object.values(this.backgrounds)[i][k];

            const thumbnail: HTMLElement = document.createElement("div");
            thumbnail.className = "thumbnail";
            thumbnailContainer?.appendChild(thumbnail);

            const image: HTMLElement = document.createElement("div");
            image.className = "image";
            thumbnail.appendChild(image);

            if (background.type === "colour") {
               image.style.backgroundColor = background.content;
            } else if (background.type === "image") {
               image.style.backgroundImage = `url(${require("../images/backgrounds/" + background.content).default})`;
            }

            if (this.currentBackgroundIndexes[i] === k) {
               this.selectThumbnail(thumbnail, backgroundType);
            }

            thumbnail.addEventListener("click", () => {
               this.currentBackgroundIndexes[i] = k;

               this.selectThumbnail(thumbnail, backgroundType);
               this.updateBackgrounds();
            });

            const hoverText: HTMLElement = document.createElement("span");
            hoverText.innerHTML = `"${background.name}"`;
            hoverText.className = "hidden";
            thumbnail.appendChild(hoverText);

            thumbnail.addEventListener("mouseover", () => {
               hoverText.classList.remove("hidden");
            });
            thumbnail.addEventListener("mouseleave", () => {
               hoverText.classList.add("hidden");
            });
         }
      }
   },
   selectThumbnail: function(thumbnail: HTMLElement, backgroundType: string): void {
      getElem(this.elementID)?.querySelector(`.${backgroundType}-thumbnail-container .thumbnail.selected`)?.classList.remove("selected");
      thumbnail.classList.add("selected");
   },
   updateBackgrounds: function(): void {
      const backgroundContainerNames = Object.keys(this.backgrounds);
      for (let i = 0; i < backgroundContainerNames.length; i++) {
         const background = Object.values(this.backgrounds)[i][this.currentBackgroundIndexes[i]];

         const backgroundContainer: HTMLElement = (getElem(backgroundContainerNames[i]) as HTMLElement);

         if (background.type === "colour") {
            backgroundContainer.style.backgroundImage = "none";
            backgroundContainer.style.backgroundColor = background.content;
         } else if (background.type === "image") {
            backgroundContainer.style.backgroundImage = `url(${require("../images/backgrounds/" + background.content).default})`;
            if (background.isTileable) {
               backgroundContainer.classList.add("tileable");
            } else {
               backgroundContainer.classList.remove("tileable");
            }
         }
      }
   }
}

export default preferences;