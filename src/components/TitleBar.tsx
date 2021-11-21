import React from "react";
import UIButton from "./UIButton";

interface TitleBarProps {
   title: string;
   titleStyle?: string;
   titleIconSrc?: string;
   hasMinimizeButton: boolean;
   isDraggable: boolean;
}

const TitleBar = (props: TitleBarProps) => {
   let titleStyle = {};
   if (props.titleStyle === "bold") {
      titleStyle = { fontWeight: "bold" };
   }

   return (
      <div style={titleStyle} className={`title-bar ${props.isDraggable ? "draggable" : ""}`}>
         {props.titleIconSrc ? 
         <img src={props.titleIconSrc} alt="" />
         : ""}

         <span>{props.title}</span>

         {props.hasMinimizeButton ?
         <UIButton type="minimize" />
         : ""}
      </div>
   )
}

export default TitleBar;
