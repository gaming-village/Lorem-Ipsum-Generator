import React from "react";
import MinimizeButton from "../images/ui/minimize.png";

interface TitleBarProps {
   title: string;
   hasMinimizeButton: boolean;
}

const TitleBar = (props: TitleBarProps) => {
   return (
      <div className="title-bar">
         {props.title}
         {props.hasMinimizeButton ? <img src={MinimizeButton} draggable="false" className="minimize" alt="" /> : ""}
      </div>
   )
}

export default TitleBar;
