import React, { MouseEventHandler } from "react";

interface UIButtonProps {
   type: "close" | "minimize";
   onClick?: MouseEventHandler;
   isClickable?: boolean;
}

const UIButton = (props: UIButtonProps) => {
   const buttonTypesSrc = {
      close: "close.png",
      minimize: "minimize.png"
   };
   const imgSrc = require(`../images/ui/${buttonTypesSrc[props.type]}`).default;
   return (
      <img onClick={props.onClick} className={`ui-button ui-${props.type} ${!props.isClickable ? "" : "unclickable"}`} alt="" src={imgSrc} draggable="false" />
   )
}

export default UIButton;
