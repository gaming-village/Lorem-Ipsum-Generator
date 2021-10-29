import React from "react";
import TopBar from "./components/TopBar";
import Computer from "./components/Computer";
import CorporateOverview from "./components/CorporateOverview";
import Mail from "./components/Mail";
import Settings from "./components/Settings";

function App() {
   return (
      <>
         <TopBar />
         <Computer />
         <CorporateOverview />
         <Mail />
         <Settings />
      </>
   );
}

export default App;
