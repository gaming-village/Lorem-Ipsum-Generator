import React from "react";
import TopBar from "./components/TopBar";
import Computer from "./components/Computer";
import CorporateOverview from "./components/CorporateOverview";
import Mail from "./components/Mail";
import Settings from "./components/Settings";
import Program from "./components/Program";
import Button from "./components/Button";
import ButtonContainer from "./components/ButtonContainer";

function App() {
   return (
      <>
         <Program id="devtools" className="hidden" title="Devtools" titleIconSrc={require("./images/icons/settings.png").default} hasMinimizeButton={false}>
            <>
               <h2 className="resources">Resources</h2>

               <div className="resources-tab">
                  <p>Add or set the lorem count.</p>
                  <input className="lorem-input" />
                  <ButtonContainer>
                     <>
                        <Button className="add-lorem" text="Add" />
                        <Button className="set-lorem" text="Set" />
                     </>
                  </ButtonContainer>
               </div>

               <h2 className="mail">Mail</h2>

               <div className="mail-tab">
                  <p>Receive letter</p>

                  <select className="letter-select" name="Letters"></select>

                  <Button className="receive-letter-button" text="Receive" />

                  <p>Receive all letters</p>
                  <Button className="receive-all-letters-button" text="Receive All" />
               </div>

               <h2 className="data">Data</h2>

               <div className="data-tab">
                  <Button text="Reset" className="reset-button" isCentered={true} />
               </div>
            </>
         </Program>

         <div id="mask" className="hidden"></div>

         <div id="notification-container"></div>

         <TopBar />
         <Computer />
         <CorporateOverview />
         <Mail />
         <Settings />
      </>
   );
}

export default App;
