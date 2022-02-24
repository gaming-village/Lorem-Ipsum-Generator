import React, { LegacyRef } from "react";
import UIButton from "./UIButton";

type UIButtonType = "minimize" | "close";
interface TitleBarProps {
   title: string;
   titleStyle?: string;
   iconSrc?: string;
   uiButtons: ReadonlyArray<UIButtonType>;
   buttonsAreDark?: boolean;
   minimizeFunc?: () => void;
   closeFunc?: () => void;
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
         {props.iconSrc ? 
         <img src={props.iconSrc} alt="" />
         : ""}

         <span>{props.title}</span>

         {props.uiButtons.includes("minimize") ?
            <UIButton isClickable={props.buttonsAreDark} onClick={props.minimizeFunc} type="minimize" />
         : <></> }
         {props.uiButtons.includes("close") ?
            <UIButton isClickable={props.buttonsAreDark} onClick={props.closeFunc} type="close" />
         : <></> }
      </div>
   )
});

export default TitleBar;
