import "./css/applications.css";

const fileNames: ReadonlyArray<string> = ["LoremCounter", "AchievementTracker"];
let unlockInfo: ReadonlyArray<0 | 1> = fileNames.map(_ => 0);

export function setUnlockedApplications(bitmap: ReadonlyArray<0 | 1>): void {
   unlockInfo = bitmap;
}

export function setupApplications() {
   const applications = fileNames.map(fileName => require("./classes/applications/" + fileName).default)

   for (let i = 0; i < applications.length; i++) {
      const application = applications[i];
      new application(unlockInfo[i]);
   }

   // Loop again once Game.applications is filled
   for (const application of applications) {
      if (application.setup) application.setup();
   }
}