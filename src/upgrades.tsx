import WORKERS, { Worker } from "./data/workers";
import UPGRADES, { Upgrade, UpgradeRequirements } from "./data/upgrades-data";
import React from "react";
import WindowsProgram from "./components/WindowsProgram";
import Game from "./Game";
import Button from "./components/Button";
import { loremCorp } from "./corporate-overview";
import { getElem } from "./utils";

interface UpgradesDictionary {
   [key: number]: Array<JSX.Element>;
}

const getUpgradeRow = (upgrades: Array<JSX.Element>, key: number): JSX.Element => {
   return (
      <div className="upgrade-row" key={key}>{upgrades}</div>
   )
}

const getUpgradeObject = (id: number): HTMLElement => {
   return getElem("corporate-overview").querySelector(`.upgrade-${id}`) as HTMLElement;
}

const buyUpgrade = (upgradeInfo: Upgrade, upgradeID: number): void => {
   if (upgradeInfo.isBought) return;

   const requirements: UpgradeRequirements = upgradeInfo.requirements;

   // Check if the upgrade's requirements are met
   if (requirements.lorem && Game.lorem < requirements.lorem) return;
   if (requirements.workers) {
      for (let i = 0; i < Object.entries(requirements.workers).length; i++) {
         const workerRequirement = requirements.workers[WORKERS[i].name];
         if (workerRequirement && loremCorp.workers[i] < workerRequirement) {
            return;
         }
      }
   }
   
   // Buy upgrade
   if (requirements.lorem) Game.lorem -= requirements.lorem;
   if (requirements.workers) {
      for (let i = 0; i < Object.entries(requirements.workers).length; i++) {
         const workerRequirement = requirements.workers[WORKERS[i].name];
         if (workerRequirement) {
            loremCorp.workers[i] -= workerRequirement;
         }
      }
      loremCorp.updateCorporateOverview();
   }
   upgradeInfo.isBought = true;

   const upgrade = getUpgradeObject(upgradeID);
   upgrade.classList.add("bought");

   const buyButton = upgrade.querySelector("button")!;
   buyButton.classList.add("dark");
   buyButton.innerHTML = "Bought";

   if (upgradeInfo.name === "Intern Motivation") {
      Game.updateMotivation();
   }
}

const createRequirementsString = (upgradeInfo: Upgrade): string => { 
   let requirements: string = "";
   if (upgradeInfo.requirements.lorem) requirements += `, ${upgradeInfo.requirements.lorem} lorem`;
   if (upgradeInfo.requirements.workers) {
      for (const worker of Object.entries(upgradeInfo.requirements.workers)) {
         requirements += `, ${worker[1]} ${worker[0]}s`;
      }
   }

   requirements = requirements.substring(2, requirements.length);

   return requirements;
}

export function getUpgrades(job: Worker): ReadonlyArray<JSX.Element> {
   let upgradesArray: Array<JSX.Element> = [];

   const maxTier = WORKERS.indexOf(job) + 1;

   const upgradesDictionary: UpgradesDictionary = {};

   for (let i = 0; i < UPGRADES.length; i++) {
      const upgradeInfo: Upgrade = UPGRADES[i];
      if (upgradeInfo.tier > maxTier) {
         break;
      }

      const upgrade = <WindowsProgram key={i} className={`upgrade upgrade-${i} ${upgradeInfo.isBought ? "bought" : ""}`} title={upgradeInfo.name}>
         <>
            <p>{upgradeInfo.description}</p>

            <div className="requirements text-box">{createRequirementsString(upgradeInfo)}</div>

            <Button className={upgradeInfo.isBought ? "dark" : ""} isCentered={true} onClick={() => buyUpgrade(upgradeInfo, i)}>{!upgradeInfo.isBought ? "Buy Upgrade" : "Bought"}</Button>
         </>
      </WindowsProgram>

      if (!upgradesDictionary.hasOwnProperty(upgradeInfo.tier)) {
         upgradesDictionary[upgradeInfo.tier] = [ upgrade ];
      } else {
         upgradesDictionary[upgradeInfo.tier].push(upgrade);
      }

      const nextUpgrade = UPGRADES[i + 1];
      if (nextUpgrade === undefined || nextUpgrade.tier > upgradeInfo.tier) {
         const upgradeRow = getUpgradeRow(upgradesDictionary[upgradeInfo.tier], i);
         upgradesArray.push(upgradeRow);
      }
   }

   return upgradesArray;
}

export function hasUpgrade(name: string): boolean {
   for (const upgrade of UPGRADES) {
      if (upgrade.name === name) {
         return upgrade.isBought!;
      }
   }
   throw new Error(`Upgrade 'name' does not exist!`);
}