import React from "react";

interface TitleBarProps {
   title: string;
   hasMinimizeButton: boolean;
}

const TitleBar = (props: TitleBarProps) => {
   return (
      <div className="title-bar">
         {props.title}
         {props.hasMinimizeButton ? <img className="minimize" alt="" /> : ""}
      </div>
   )
}

export default TitleBar;
