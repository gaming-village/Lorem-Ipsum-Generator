import React from "react";

interface CorporatePanelProps {
   className?: string;
   children: JSX.Element;
}

const CorporatePanel = (props: CorporatePanelProps) => {
   return (
      <div className={`panel-container hidden ${props.className}`}>
         {props.children}
      </div>
   )
}

export default CorporatePanel;
