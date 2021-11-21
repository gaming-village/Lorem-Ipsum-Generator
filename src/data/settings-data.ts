interface SettingCategory {
   readonly id: string;
   readonly name: string;
}

export const settingCategories: ReadonlyArray<SettingCategory> = [
   {
      id: "audio",
      name: "Audio"
   },
   {
      id: "numbers",
      name: "Numbers"
   }
];

interface Setting {
   readonly label: string;
   readonly defaultValue: string | number;
   readonly category: string;
   readonly type: "slider" | "dropdown" | "checkbox";
   readonly min?: number;
   readonly max?: number;
   readonly options?: Array<string>;
}

const SETTINGS: ReadonlyArray<Setting> = [
   {
      label: "Volume",
      defaultValue: 50,
      category: "audio",
      type: "slider",
      min: 0,
      max: 100
   },
   {
      label: "Number Format",
      defaultValue: "Standard",
      category: "numbers",
      type: "dropdown",
      options: ["Standard", "Letter", "Scientific", "Decimal", "Words"]
   },
   {
      label: "Decimal Point Precision",
      defaultValue: 2,
      category: "numbers",
      type: "slider",
      min: 0,
      max: 9
   }
];

export default SETTINGS;