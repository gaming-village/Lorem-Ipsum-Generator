import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Computer from "./components/Computer";
import CorporateOverview from "./components/CorporateOverview";
import Mail from "./components/Mail";
import WindowsProgram from "./components/WindowsProgram";
import Button from "./components/Button";
import ButtonContainer from "./components/ButtonContainer";
import WelcomeScreen from "./components/WelcomeScreen";
import { NotificationContainer } from "./notifications";
import BlackMarket from "./components/BlackMarket";

function App() {
   return <>
      <WelcomeScreen />

      <WindowsProgram id="devtools" className="hidden" title="Devtools" titleIconSrc={require("./images/icons/settings.png").default}>
         <>
            <h2 className="resources">Resources</h2>

            <div className="resources-tab">
               <p>Add or set the lorem count.</p>
               <input className="lorem-input" />
               <ButtonContainer>
                  <>
                     <Button className="add-lorem">Add</Button>
                     <Button className="set-lorem">Set</Button>
                  </>
               </ButtonContainer>
            </div>

            <h2 className="mail">Mail</h2>

            <div className="mail-tab">
               <p>Receive letter</p>

               <select className="letter-select" name="Letters"></select>

               <Button className="receive-letter-button">Receive</Button>

               <p>Receive all letters</p>
               <Button className="receive-all-letters-button">Receive all</Button>
            </div>

            <h2 className="data">Data</h2>

            <div className="data-tab">
               <Button className="reset-button" isCentered={true}>Reset</Button>
            </div>
         </>
      </WindowsProgram>

      <div id="mask" className="hidden"></div>

      <NotificationContainer />

      <Navbar />
      
      <Computer />
      <Mail />
      <CorporateOverview />
      <BlackMarket />
   </>;
}

export default App;
