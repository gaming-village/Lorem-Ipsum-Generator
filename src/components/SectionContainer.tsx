import React from "react";

interface SectionContainerProps {
   children: JSX.Element;
}

const SectionContainer = (props: SectionContainerProps) => {
   return (
      <div className="ui-section-container">
         {props.children}
      </div>
   )
}

export default SectionContainer;
