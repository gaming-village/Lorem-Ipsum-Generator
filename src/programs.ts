export function setupPrograms() {
   const fileNames: ReadonlyArray<string> = ["ApplicationShop", "Preferences", "Settings"];
   const programClasses = fileNames.map(fileName => require("./classes/programs/" + fileName).default);

   const programs = new Array<any>();
   for (const program of programClasses) {
      programs.push(new program());
   }
   // Setup all after Game.programs if filled
   for (const program of programs) {
      if (program.setup) program.setup();
   }
}