import React, { LegacyRef } from "react";
import UIButton from "./UIButton";

interface TitleBarProps {
   title: string;
   titleStyle?: string;
   titleIconSrc?: string;
   hasMinimizeButton: boolean;
   minimizeFunc?: () => void;
   isDraggable: boolean;
   refTransfer?: HTMLElement | null;
}

const TitleBar = React.forwardRef((props: TitleBarProps, ref: LegacyRef<HTMLDivElement>) => {
   let titleStyle = {};
   if (props.titleStyle === "bold") {
      titleStyle = { fontWeight: "bold" };
   }

   return (
      <div ref={ref} style={titleStyle} className={`title-bar ${props.isDraggable ? "draggable" : ""}`}>
         {props.titleIconSrc ? 
         <img src={props.titleIconSrc} alt="" />
         : ""}

         <span>{props.title}</span>

         {props.hasMinimizeButton ?
         <UIButton onClick={props.minimizeFunc} type="minimize" />
         : ""}
      </div>
   )
});

export default TitleBar;
