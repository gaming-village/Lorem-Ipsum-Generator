import { useState } from "react";
import Game from "../../Game";
import Program from "./Program";

enum SettingsCategories {
   audio = "Audio",
   numerals = "Numerals",
   graphics = "Graphics"
}
interface SettingInfo {
   id: string;
   label: string;
   category: SettingsCategories;
   type: "range";
   iconSrc: string;
   value: number;
}
interface RangeSetting extends SettingInfo {
   value: number;
   min: number;
   max: number;
   step: number;
   suffix?: string;
}
export type SettingsType = Array<RangeSetting>;
const defaultSettings: SettingsType = [
   {
      id: "volume",
      label: "Master Volume",
      category: SettingsCategories.audio,
      type: "range",
      iconSrc: "audio.png",
      value: 90,
      min: 0,
      max: 100,
      step: 1,
      suffix: "%"
   }
];

export function getDefaultSettings(): SettingsType {
   return defaultSettings;
}

const updateSettings = (newSettings: SettingsType): void => {
   Game.settings = newSettings;
}

const Elem = (): JSX.Element => {
   const [settings, setSettings] = useState(Game.settings);

   updateSettings(settings);

   let key = 0;
   const content = new Array<JSX.Element>();

   const sortedSettings = Object.values(SettingsCategories).reduce((previousValue, currentValue) => {
      return { ...previousValue, [currentValue]: [] };
   }, {}) as { [key in SettingsCategories]: SettingsType };

   for (const setting of settings) {
      sortedSettings[setting.category].push(setting);
   }

   for (const [categoryName, categorySettings] of Object.entries(sortedSettings)) {
      content.push(
         <h2 key={key++}>{categoryName}</h2>
      );

      const settingsArr = new Array<JSX.Element>();

      for (const setting of categorySettings) {
         let iconSrc!: string;
         try {
            iconSrc = require("../../images/settings-icons/" + setting.iconSrc).default;
         } catch {
            iconSrc = require("../../images/icons/questionmark.png").default;
         }

         const changeVal = (newVal?: number): void => {
            if (typeof newVal === "undefined") {
               newVal = parseFloat((window.event!.target as HTMLInputElement).value);
            }
            const newSettingsArr = settings.slice();
            for (const currentSetting of newSettingsArr) {
               if (currentSetting === setting) {
                  currentSetting.value = newVal;
               }
            }
            setSettings(newSettingsArr);
         }

         let input!: JSX.Element;
         if (setting.type === "range") {
            const { value, min, max, step } = setting as RangeSetting;
            input = <input type="range" onChange={() => changeVal()} min={min} max={max} step={step} value={value} />
         }

         settingsArr.push(
            <div className="setting" key={key++}>
               <div className="formatter">
                  <div className="formatter">
                     <img className="icon" src={iconSrc} alt="Settings icon" />
                     <div>
                        <div className="label">{setting.label}</div>
                        {input}
                     </div>
                  </div>

                  <div className="value">{setting.value}{setting.suffix}</div>
               </div>
            </div>
         );
      }

      content.push(
         <div key={key++}>
            {settingsArr}
         </div>
      );
   }

   return <>
      <p>Manage your Computer's visual, performance and audio preferences.</p>

      {content}
   </>
}

class Settings extends Program {
   constructor() {
      super({
         name: "Settings",
         id: "settings"
      });
   }

   protected instantiate(): JSX.Element {
      return <Elem />
   }
}

export default Settings;