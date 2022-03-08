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
   isAlwaysSelected?: boolean;
   refTransfer?: HTMLElement | null;
}

const TitleBar = React.forwardRef((props: TitleBarProps, ref: LegacyRef<HTMLDivElement>) => {
   const titleStyle: React.CSSProperties = {
      fontWeight: props.titleStyle === "bold" ? 600 : undefined,
      backgroundColor: props.isAlwaysSelected ? "#071e81" : undefined
   };

   return <div ref={ref} style={titleStyle} className={`title-bar${props.isDraggable ? " draggable" : ""}`}>
      {props.iconSrc ? (
         <img src={props.iconSrc} alt="" />
      ) : undefined}

      <span>{props.title}</span>

      {props.uiButtons.includes("minimize") ? (
         <UIButton isClickable={props.buttonsAreDark} onClick={props.minimizeFunc} type="minimize" />
      ) : undefined }
      {props.uiButtons.includes("close") ? (
         <UIButton isClickable={props.buttonsAreDark} onClick={props.closeFunc} type="close" />
      ) : undefined }
   </div>;
});

export default TitleBar;
