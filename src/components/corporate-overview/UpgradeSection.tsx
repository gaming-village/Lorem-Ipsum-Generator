import { useState, useEffect } from "react";

import Button from "../Button";
import TitleBar from "../TitleBar";

import Game from "../../Game";
import { MainUpgradeInfo, MAIN_UPGRADE_DATA, MinorUpgradeInfo, MINOR_UPGRADE_DATA, UpgradeInfo } from "../../data/upgrade-data";
import { JOB_DATA, JOB_TIER_DATA } from "../../data/job-data";
import { SectionProps } from "./CorporateOverview";
import Sprite from "../../classes/Sprite";

let addUnlockedUpgrade: ((upgrade: MinorUpgradeInfo) => void) | null = null;
let addBoughtUpgrade: ((upgrade: MainUpgradeInfo) => void) | null = null;

export let typingSpeedMultiplier: number = 1;

export let additiveTypingProductionBonus: number = 0;
export let multiplicativeTypingProductionBonus: number = 1;
export let additiveWorkerProductionBonus: number = 0;
export let multiplicativeWorkerProductionBonus: number = 1;

export let individualWorkerProductionBonuses: { [key: string]: { additiveBonus: number, multiplicativeBonus: number } } = JOB_DATA.reduce((previousValue, currentValue) => {
   return { ...previousValue, [currentValue.id]: { additiveBonus: 0, multiplicativeBonus: 1 } };
}, {});

export let workerProductionBonuses = {
   additive: 0,
   multiplicative: 1
};

/**
 * Used to find whether the user owns an upgrade or not.
 * @param name The name of the upgrade
 * @returns If the upgrade is owned.
 */
 export function hasUpgrade(name: string): boolean {
   for (const upgrade of MAIN_UPGRADE_DATA) {
      if (upgrade.name === name) return upgrade.isBought || false;
   }
   throw new Error(`Upgrade '${name}' does not exist!`);
}

const getUpgradeRequirements = (upgrade: UpgradeInfo): ReadonlyArray<string> => {
   const upgradeRequirements = new Array<string>();

   if (typeof upgrade.costs.lorem !== "undefined") {
      upgradeRequirements.push(`${upgrade.costs.lorem} Lorem`);
   }

   if (typeof upgrade.costs.workers !== "undefined") {
      for (const [workerTier, count] of Object.entries(upgrade.costs.workers)) {
         const worker = Game.userInfo.previousJobs[Number(workerTier) - 1];

         upgradeRequirements.push(`${count} ${worker.name}${Number(count) !== 1 ? "s" : ""}`);
      }
   }
   return upgradeRequirements;
}

const canBuyUpgrade = (upgrade: UpgradeInfo, lorem: number): boolean => {
   for (const [type, requirement] of Object.entries(upgrade.costs)) {
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

export function updateUnlockedTypingUpgrades(): void {
   for (const upgrade of MINOR_UPGRADE_DATA) {
      if (typeof upgrade.unlockRequirements.wordsTyped !== "undefined") {
         if (Game.wordsTyped >= upgrade.unlockRequirements.wordsTyped) {
            upgrade.isUnlocked = true;
            if (addUnlockedUpgrade !== null) {
               addUnlockedUpgrade(upgrade);
            }
         }
      }
   }
}

export function updateUnlockedWorkerUpgrades(): void {
   let totalWorkerCount = 0;
   for (const job of Game.userInfo.previousJobs) {
      totalWorkerCount += Game.userInfo.workers[job.id];
   }

   for (const upgrade of MINOR_UPGRADE_DATA) {
      if (typeof upgrade.unlockRequirements.workers !== "undefined") {
         for (const [workerTier, requiredCount] of Object.entries(upgrade.unlockRequirements.workers)) {
            if (Number(workerTier) > Game.userInfo.previousJobs.length) continue;
            const worker = Game.userInfo.previousJobs[Number(workerTier) - 1];

            if (Game.userInfo.workers[worker.id] >= Number(requiredCount)) {
               upgrade.isUnlocked = true;
               if (addUnlockedUpgrade !== null) {
                  addUnlockedUpgrade(upgrade);
               }
            }
         }
      }

      if (typeof upgrade.unlockRequirements.totalWorkers !== "undefined") {
         if (totalWorkerCount >= upgrade.unlockRequirements.totalWorkers) {
            upgrade.isUnlocked = true;
            if (addUnlockedUpgrade !== null) {
               addUnlockedUpgrade(upgrade);
            }
         }
      }
   }
}

/** Calculates and applies an upgrade's bonuses */
const applyUpgradeProductionBonuses = (upgrade: UpgradeInfo): void => {
   // Typing bonuses
   if (typeof upgrade.effects?.additiveTypingProductionBonus !== "undefined") {
      additiveTypingProductionBonus += upgrade.effects.additiveTypingProductionBonus
   }
   if (typeof upgrade.effects?.multiplicativeTypingProductionBonus !== "undefined") {
      multiplicativeTypingProductionBonus *= 1 + upgrade.effects.multiplicativeTypingProductionBonus
   }

   // Worker production bonuses
   if (typeof upgrade.effects?.additiveWorkerProductionBonus !== "undefined") {
      additiveWorkerProductionBonus += upgrade.effects.additiveWorkerProductionBonus
   }
   if (typeof upgrade.effects?.multiplicativeWorkerProductionBonus !== "undefined") {
      multiplicativeWorkerProductionBonus *= 1 + upgrade.effects.multiplicativeWorkerProductionBonus
   }

   // Individual worker production bonuses
   if (typeof upgrade.effects?.individualWorkerBonuses !== "undefined") {
      for (const [workerTier, bonuses] of Object.entries(upgrade.effects.individualWorkerBonuses)) {
         if (Number(workerTier) > Game.userInfo.previousJobs.length) continue;
         
         const worker = Game.userInfo.previousJobs[Number(workerTier) - 1];

         // Apply bonuses
         if (typeof bonuses.additiveBonus !== "undefined") {
            individualWorkerProductionBonuses[worker.id].additiveBonus += bonuses.additiveBonus;
         }
         if (typeof bonuses.multiplicativeBonus !== "undefined") {
            individualWorkerProductionBonuses[worker.id].multiplicativeBonus *= 1 + bonuses.multiplicativeBonus;
         }
      }
   }

   // Overall worker production bonuses
   if (typeof upgrade.effects?.workerBonuses !== "undefined") {
      // Additive bonuses
      if (typeof upgrade.effects.workerBonuses.additive !== "undefined") {
         workerProductionBonuses.additive += upgrade.effects.workerBonuses.additive;
      }

      // Multiplicative bonuses
      if (typeof upgrade.effects.workerBonuses.multiplicative !== "undefined") {
         workerProductionBonuses.multiplicative *= 1 + upgrade.effects.workerBonuses.multiplicative;
      }
   }

   // Typing speed bonus
   if (typeof upgrade.effects?.typingSpeedBonus !== "undefined") {
      typingSpeedMultiplier *= 1 + upgrade.effects.typingSpeedBonus;
   }
}

export function calculateProductionBonuses(): void {
   const allUpgrades = [...MAIN_UPGRADE_DATA, ...MINOR_UPGRADE_DATA];
   for (const upgrade of allUpgrades) {
      if (upgrade.isBought) {
         applyUpgradeProductionBonuses(upgrade);
      }
   }
}

const buyUpgrade = (upgrade: UpgradeInfo): void => {
   console.log(upgrade);
   upgrade.isBought = true;

   if (typeof upgrade.costs.lorem !== "undefined") {
      Game.lorem -= upgrade.costs.lorem;
   }

   if (typeof upgrade.costs.workers !== "undefined") {
      for (const [workerTier, workerCount] of Object.entries(upgrade.costs.workers)) {
         console.log(`Tier ${workerTier} cost: ${workerCount}`);
         const worker = Game.userInfo.previousJobs[Number(workerTier) - 1];
         Game.userInfo.workers[worker.id] -= Number(workerCount);
      }
   }

   applyUpgradeProductionBonuses(upgrade);
   if (upgrade.hasOwnProperty("tier")) {
      if (addBoughtUpgrade !== null) addBoughtUpgrade(upgrade as MainUpgradeInfo);
   }
}

interface MinorUpgradeProps {
   upgrade: MinorUpgradeInfo;
}
const MinorUpgrade = ({ upgrade }: MinorUpgradeProps): JSX.Element => {
   const [isHovering, setIsHovering] = useState(false);

   const mouseOver = (): void => {
      setIsHovering(true);
   }

   const mouseOut = (): void => {
      setIsHovering(false);
   }

   let iconSrc!: string;
   try {
      iconSrc = require("../../images/icons/" + upgrade.iconSrc).default;
   } catch {
      iconSrc = require("../../images/icons/questionmark.png").default;
   }

   const sprite = new Sprite(40, 40, "upgrade-icons", upgrade.icon || 0);
   const icon = sprite.element;

   const canAfford = Game.lorem >= upgrade.costs.lorem!;

   return <div onClick={canAfford ? () => buyUpgrade(upgrade) : undefined} onMouseEnter={mouseOver} onMouseLeave={mouseOut} className={`minor-upgrade${canAfford ? " can-afford" : ""}`}>
      <div className="formatter">
         <div className="formatter">
            {typeof upgrade.icon !== "undefined" ? icon : (
               <img src={iconSrc} alt={upgrade.iconSrc} />
            )}

            <p className="name">{upgrade.name}</p>
         </div>

         <p className="cost">{upgrade.costs.lorem!} lorem</p>
      </div>

      {isHovering ? <>
         <div className="separator"></div>

         <p className="description">{typeof upgrade.description === "function" ? upgrade.description() : upgrade.description}</p>

         {typeof upgrade.flavourText !== "undefined" ? (
            <p className="flavour-text">{upgrade.flavourText}</p>
         ) : undefined}
      </> : undefined}
   </div>;
}

const getUnlockedUpgrades = (): Array<MinorUpgradeInfo> => {
   const unlockedUpgrades = new Array<MinorUpgradeInfo>();

   for (const upgrade of MINOR_UPGRADE_DATA) {
      if (upgrade.isUnlocked) {
         unlockedUpgrades.push(upgrade);
      }
   }

   return unlockedUpgrades;
}

/** Returns a list of all unlocked upgrades, sorted in terms of lorem cost */
const getBuyableUpgrades = (unlockedUpgrades: Array<MinorUpgradeInfo>): Array<MinorUpgradeInfo> => {
   const buyableUpgrades = new Array<MinorUpgradeInfo>();

   // Get all buyable upgrades
   for (const upgrade of unlockedUpgrades) {
      if (!upgrade.isBought) {
         buyableUpgrades.push(upgrade);
      }
   }

   // Sort the array in terms of lorem count
   const sortedUpgrades = new Array<MinorUpgradeInfo>();

   for (const upgrade of buyableUpgrades) {
      if (sortedUpgrades.length === 0) {
         sortedUpgrades.push(upgrade);
      } else {
         let hasInsertedUpgrade = false;
         for (let i = 0; i < sortedUpgrades.length; i++) {
            const upgrade2 = sortedUpgrades[i];

            if (upgrade2.costs.lorem! > upgrade.costs.lorem!) {
               sortedUpgrades.splice(i, 0, upgrade);
               hasInsertedUpgrade = true;
               break;
            }
         }

         // If there are no upgrades more expensive than it, add it to the end of the array
         if (!hasInsertedUpgrade) {
            sortedUpgrades.push(upgrade);
         }
      }
   }

   return sortedUpgrades;
}

const getBoughtUpgrades = (): Array<UpgradeInfo> => {
   const boughtUpgrades = new Array<UpgradeInfo>();

   for (const upgrade of MAIN_UPGRADE_DATA) {
      if (upgrade.isBought) boughtUpgrades.push(upgrade);
   }

   return boughtUpgrades;
}

const UpgradeSection = ({ job }: SectionProps) => {
   const [lorem, setLorem] = useState(Game.lorem);
   const [unlockedUpgrades, setUnlockedUpgrades] = useState<Array<MinorUpgradeInfo>>(getUnlockedUpgrades());
   const [boughtUpgrades, setBoughtUpgrades] = useState<Array<UpgradeInfo>>(getBoughtUpgrades());

   useEffect(() => {
      addUnlockedUpgrade = (upgrade: MinorUpgradeInfo) => {
         if (unlockedUpgrades.includes(upgrade)) return;
         
         const newUnlockedUpgrades = unlockedUpgrades.slice();
         newUnlockedUpgrades.push(upgrade);
         setUnlockedUpgrades(newUnlockedUpgrades);
      }

      addBoughtUpgrade = (upgrade: MainUpgradeInfo) => {
         const newBoughtUpgrades = boughtUpgrades.slice();
         newBoughtUpgrades.push(upgrade);
         setBoughtUpgrades(newBoughtUpgrades);
      }

      return () => {
         addUnlockedUpgrade = null;
      }
   }, [boughtUpgrades, unlockedUpgrades]);

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
   for (let i = 0; i < MAIN_UPGRADE_DATA.length; i++) {
      const upgrade = MAIN_UPGRADE_DATA[i];

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
      const isBought = upgrade.isBought;
      const canBuy = !isBought && canBuyUpgrade(upgrade, lorem);

      upgradeRow.push(
         <div key={key++} className={`upgrade${isBought ? " bought" : ""}`}>
            <TitleBar title={upgrade.name} uiButtons={[]} isDraggable={false} />
            
            <p className="description">{upgrade.description}</p>

            <div className="requirements">
               {upgradeRequirements.reduce((previousValue, currentValue, i) => {
                  return previousValue + currentValue + (i < upgradeRequirements.length - 1 ? ", " : "");
               }, "")}
            </div>

            <Button onClick={canBuy ? () => buyUpgrade(upgrade) : undefined} isFlashing={canBuy} isDark={isBought} isCentered>{isBought ? "Bought" : "Purchase"}</Button>
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
      MAIN_UPGRADE_DATA.reduce((previousValue, currentValue) => {
         if (currentValue.tier === job.tier + 1) {
            return previousValue + 1;
         }
         return previousValue;
      }, 0)
   ) : null;

   const buyableUpgrades = getBuyableUpgrades(unlockedUpgrades);

   return <div id="upgrades">
      <div id="all-upgrades" className="windows-program">
         <div className="title-bar" style={{backgroundColor: "rgb(7, 30, 129)"}}>Minor Upgrades</div>

         {buyableUpgrades.map((upgrade, i) => {
            return <MinorUpgrade upgrade={upgrade} key={i} />
         })}
      </div>

      {content}

      {job.tier < JOB_TIER_DATA.length ? (
         <p className="notice">Get promoted to unlock {numNextUpgrades!} more upgrade{numNextUpgrades! !== 1 ? "s" : ""}!</p>
      ) : ""}
   </div>;
}

export default UpgradeSection;