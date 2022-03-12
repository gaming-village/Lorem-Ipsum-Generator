import { useState, useEffect } from "react";

import Button from "../Button";
import TitleBar from "../TitleBar";

import Game from "../../Game";
import UPGRADE_DATA, { UpgradeInfo } from "../../data/upgrade-data";
import { JobInfo, JOB_DATA, JOB_TIER_DATA } from "../../data/job-data";
import { SectionProps } from "./CorporateOverview";

/**
 * Used to find whether the user owns an upgrade or not.
 * @param name The name of the upgrade
 * @returns If the upgrade is owned.
 */
 export function hasUpgrade(name: string): boolean {
   for (const upgrade of UPGRADE_DATA) {
      if (upgrade.name === name) return upgrade.isBought || false;
   }
   throw new Error(`Upgrade '${name}' does not exist!`);
}

const getUpgradeRequirements = (upgrade: UpgradeInfo): ReadonlyArray<string> => {
   const upgradeRequirements = new Array<string>();

   if (typeof upgrade.requirements.lorem !== "undefined") {
      upgradeRequirements.push(`${upgrade.requirements.lorem} Lorem`);
   }

   if (typeof upgrade.requirements.workers !== "undefined") {
      for (const [workerTier, count] of Object.entries(upgrade.requirements.workers)) {
         const worker = Game.userInfo.previousJobs[Number(workerTier) - 1];

         upgradeRequirements.push(`${count} ${worker.name}${count !== 1 ? "s" : ""}`);
      }
   }
   return upgradeRequirements;
}

const canBuyUpgrade = (upgrade: UpgradeInfo, lorem: number): boolean => {
   for (const [type, requirement] of Object.entries(upgrade.requirements)) {
      switch (type) {
         case "lorem": {
            if (lorem < requirement) {
               return false;
            }
            break;
         }
         case "workers": {
            for (const [workerTier, workerCount] of Object.entries(requirement)) {
               const worker = Game.userInfo.previousJobs[Number(workerTier) - 1];
               if (Game.userInfo.workers[worker.id] < Number(workerCount)) {
                  return false;
               }
            }
            break;
         }
      }
   }
   return true;
}

const buyUpgrade = (upgrade: UpgradeInfo): void => {
   upgrade.isBought = true;

   if (typeof upgrade.requirements.lorem !== "undefined") {
      Game.lorem -= upgrade.requirements.lorem;
   }
   if (typeof upgrade.requirements.workers !== "undefined") {
      for (const [workerID, workerCount] of Object.entries(upgrade.requirements.workers)) {
         Game.userInfo.workers[workerID] -= workerCount;
      }
   }
}

const UpgradeSection = ({ job }: SectionProps) => {
   const [lorem, setLorem] = useState(Game.lorem);

   useEffect(() => {
      const updateLoremCount = (): void => {
         if (Game.lorem !== lorem) setLorem(Game.lorem);
      }

      Game.createRenderListener(updateLoremCount);

      return () => {
         Game.removeRenderListener(updateLoremCount);
      }
   }, [lorem]);
   
   let content = new Array<JSX.Element>();
   let key = 0;

   let upgradeRow = new Array<JSX.Element>();
   let previousTier = 1;
   for (let i = 0; i < UPGRADE_DATA.length; i++) {
      const upgrade = UPGRADE_DATA[i];

      if (upgrade.tier > job.tier) {
         break;
      }

      if (upgrade.tier !== previousTier) {
         content.push(
            <div key={key++} className="upgrade-container">
               {upgradeRow}
            </div>
         );

         upgradeRow = new Array<JSX.Element>();
      }

      const upgradeRequirements = getUpgradeRequirements(upgrade);
      const canBuy = canBuyUpgrade(upgrade, lorem);
      const isBought = hasUpgrade(upgrade.name);

      upgradeRow.push(
         <div key={key++} className={`upgrade${isBought ? " bought" : ""}`}>
            <TitleBar title={upgrade.name} uiButtons={[]} isDraggable={false} />
            
            <p className="description">{upgrade.description}</p>

            <div className="requirements">
               {upgradeRequirements.reduce((previousValue, currentValue, i) => {
                  return previousValue + currentValue + (i < upgradeRequirements.length - 1 ? ", " : "");
               }, "")}
            </div>

            <Button onClick={canBuy && !isBought ? () => buyUpgrade(upgrade) : undefined} isFlashing={canBuy && !isBought} isDark={isBought} isCentered>{isBought ? "Bought" : "Purchase"}</Button>
         </div>
      );

      previousTier = upgrade.tier;
   }
   if (upgradeRow.length > 0) {
      content.push(
         <div key={key++} className="upgrade-container">
            {upgradeRow}
         </div>
      );
   }

   const numNextUpgrades = job.tier < JOB_TIER_DATA.length ? (
      UPGRADE_DATA.reduce((previousValue, currentValue) => {
         if (currentValue.tier === job.tier + 1) {
            return previousValue + 1;
         }
         return previousValue;
      }, 0)
   ) : null;

   return <div id="upgrades">
      {content}

      {job.tier < JOB_TIER_DATA.length ? (
         <p className="notice">Get promoted to unlock {numNextUpgrades!} more upgrade{numNextUpgrades! !== 1 ? "s" : ""}!</p>
      ) : ""}
   </div>;
}

export default UpgradeSection;