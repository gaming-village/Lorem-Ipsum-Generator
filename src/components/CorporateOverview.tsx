import React from "react";
import "../css/corporate-overview.css";
import Button from "./Button";
import CorporatePanel from "./CorporatePanel";
import Program from "./Program";

const CorporateOverview = () => {
   return (
      <div id="corporate-overview" className="view">
         <div className="left-bar">
            <Button className="home-button dark" text="Home" />
            <Button className="upgrades-button dark" text="Upgrades" />

            <h2>Career</h2>
            <p>Position: Intern</p>
            <p>Salary: N/A</p>
         </div>
         <div className="right-bar">
            <CorporatePanel className="home-panel">
               <Program className="panel" title="Overview">
                  <>
                     <h2>Job</h2>

                     <p>You are currently an intern. Your next position is as an employee.</p>
                  </>
               </Program>
            </CorporatePanel>

            <CorporatePanel className="upgrades-panel">
               <Program className="panel" title="Upgrades">
                  <>
                     <h2>Upgrades</h2>

                     <p>This is a test paragraph</p>
                  </>
               </Program>
            </CorporatePanel>
         </div>
      </div>
   )
}

export default CorporateOverview;
