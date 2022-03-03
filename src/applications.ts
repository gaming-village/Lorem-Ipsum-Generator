import APPLICATION_DATA from "./data/application-data";

export function setupApplications() {
   for (let i = 0; i < APPLICATION_DATA.length; i++) {
      const applicationInfo = APPLICATION_DATA[i];

      const application = require("./classes/applications/" + applicationInfo.className).default;
      new application(applicationInfo);
   }
}