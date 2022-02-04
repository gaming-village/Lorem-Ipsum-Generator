import { useState } from "react";
import { getElem } from "../../utils";
import Program from "./Program";

const selectedBackgrounds: [number, number, number] = [0, 0, 0];

interface PreferenceData {
   selectedBackgrounds: [number, number, number];
}
export function getPreferences(): PreferenceData {
   return {
      selectedBackgrounds: selectedBackgrounds
   };
}

export function setPreferences(newPreferences: PreferenceData): void {
   for (let i = 0; i < selectedBackgrounds.length; i++) {
      const idx = newPreferences.selectedBackgrounds[i];
      selectedBackgrounds[i] = idx;
   }
}

interface BackgroundCategory {
   name: string;
   elementID: string;
   description: string;
   backgrounds: ReadonlyArray<Background>
}
interface Background {
   content: string;
   type: "colour" | "image";
   name: string;
   isTileable?: boolean;
}
const backgroundInfo: ReadonlyArray<BackgroundCategory> = [
   {
      name: "Computer",
      elementID: "computer",
      description: "Customise your Computer's background image to your liking.",
      backgrounds: [
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
      ]
   },
   {
      name: "Mail",
      elementID: "mail",
      description: "Change the mail background",
      backgrounds: [
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
      ]
   },
   {
      name: "Corporate Overview",
      elementID: "corporate-overview",
      description: "Brighten up the day's suffering with these lifeless wallpapers!",
      backgrounds: [
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
      ]
   }
];

interface ElemProps {
   program: Preferences;
}
const Elem = ({ program }: ElemProps): JSX.Element => {
   const defaultBackgroundArray = backgroundInfo.map(category => category.backgrounds[0]);
   const [selectedBackgroundArray, setSelectedBackgroundArray] = useState<Array<Background>>(defaultBackgroundArray);

   let currentKey = 0;
   const content = new Array<JSX.Element>();
   content.push(
      <h2 key={currentKey++}>Backgrounds</h2>
   )
   
   for (let i = 0; i < backgroundInfo.length; i++) {
      const category = backgroundInfo[i];
      content.push(
         <h3 key={currentKey++}>{category.name}</h3>,
         <p key={currentKey++} style={{ marginBottom: "0.2rem" }}>{category.description}</p>
      );
         
      const categoryContent = new Array<JSX.Element>();
      for (const background of category.backgrounds) {
         let style!: React.CSSProperties;
         if (background.type === "colour") {
            style = {
               backgroundColor: background.content
            };
         } else if (background.type === "image") {
            const src = require("../../images/backgrounds/" + background.content).default;
            style = {
               backgroundImage: `url(${src})`
            };
            if (!background.isTileable) {
               style.backgroundSize = "100% 100%";
            }
         }

         const clickEvent = () => {
            const newBackgroundArray = selectedBackgroundArray.slice();
            for (let k = 0; k < selectedBackgroundArray.length; k++) {
               if (k === i) {
                  selectedBackgrounds[k] = category.backgrounds.indexOf(background);
                  newBackgroundArray[k] = background;
               }
            }
            setSelectedBackgroundArray(newBackgroundArray);

            program.updateBackgrounds();
         }

         let className = "thumbnail";
         if (selectedBackgroundArray.includes(background)) className += " selected";
         categoryContent.push(
            <div key={currentKey++} className={className} onClick={clickEvent}>
               <div className="image" style={style}></div>
               <div>"{background.name}"</div>
            </div>
         );
      }

      content.push(
         <div key={currentKey++} className="thumbnail-container">
            {categoryContent}
         </div>
      );
   }

   content.push(
      <h2>Taskbar Appearance</h2>,
      // TODO: Regular and compact modes for taskbar icon appearance
      <p>Change how your Applications appear in the taskbar.</p>
   );

   return <> {content} </>;
}

class Preferences extends Program {
   constructor() {
      super({
         name: "Preferences",
         id: "preferences"
      });
   }

   protected instantiate(): JSX.Element {
      return <Elem program={this} />;
   }

   setup(): void {
      this.updateBackgrounds();
   }

   updateBackgrounds(): void {
      for (let i = 0; i < backgroundInfo.length; i++) {
         const category = backgroundInfo[i];
         const selectedBackground = category.backgrounds[selectedBackgrounds[i]];

         const container: HTMLElement = getElem(category.elementID)!;
         if (selectedBackground.type === "colour") {
            container.style.backgroundImage = "none";
            container.style.backgroundColor = selectedBackground.content;
         } else if (selectedBackground.type === "image") {
            container.style.backgroundImage = `url(${require("../../images/backgrounds/" + selectedBackground.content).default})`;
            if (selectedBackground.isTileable) {
               container.classList.add("tileable");
            } else {
               container.classList.remove("tileable");
            }
         }
      }
   }
}

export default Preferences;