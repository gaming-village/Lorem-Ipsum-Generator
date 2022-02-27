import React from "react";

interface SectionProps {
   content: string | JSX.Element;
   fillType: "fill" | "shrink";
}

const Section = (props: SectionProps) => {
   return (
      <div className={`ui-section${props.fillType === "fill" ? " fill" : ""}`}>
         {React.isValidElement(props.content) ?
         props.content :
         <span>{props.content}</span>}
      </div>
   );
}

export default Section;
