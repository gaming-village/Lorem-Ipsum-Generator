import React from "react";

interface ScrollAreaProps {
   scrollType: "vertical" | "horizontal" | "both";
   children?: JSX.Element | Array<JSX.Element>;
}

const ScrollArea = (props: ScrollAreaProps) => {
   let className: string = "";
   if (props.scrollType === "vertical" || props.scrollType === "both") className += " vertical";
   if (props.scrollType === "horizontal" || props.scrollType === "both") className += " horizontal";
   return (
      <div className={`scroll-area${className}`}>
         {props.children}
      </div>
   )
}

export default ScrollArea;
