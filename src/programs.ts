export const programsREMOVELATER: any = {};
// const programNames: string[] = ["preferences", "application-shop"];

export function initialisePrograms() {
   // for (const name of programNames) {
   //    const program = require("./classes/programs/" + name).default;
   //    programsREMOVELATER[name] = program;
   // }
}

export function setupPrograms() {
   const fileNames: ReadonlyArray<string> = ["ApplicationShop", "Preferences"];
   const programClasses = fileNames.map(fileName => require("./classes/programs/" + fileName).default);

   const programs = new Array<any>();
   for (const program of programClasses) {
      programs.push(new program());
   }
   // Setup all after Game.programs if filled
   for (const program of programs) {
      if (program.setup) program.setup();
   }

   // for (let i = 0; i < Object.values(programsREMOVELATER).length; i++) {
   //    const program = Object.values(programsREMOVELATER)[i] as any;
   //    if (program.hasOwnProperty("setup")) {
   //       program.setup();
   //    }
   // }
}