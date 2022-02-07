import React, { MouseEventHandler } from "react"

interface ButtonProps {
   id?: string;
   className?: string;
   onClick?: MouseEventHandler;
   isCentered?: boolean;
   isFlashing?: boolean;
   isDark?: boolean;
   children: JSX.Element | string;
}

const Button = (props: ButtonProps) => {
   return (
      <button onClick={props.onClick} id={props.id} className={`button${props.className ? " " + props.className : ""}${props.isCentered ? " centered" : ""}${props.isFlashing ? " flashing" : ""}${props.isDark ? " dark" : ""}`}>
         {props.children}
      </button>
   )
}

export default Button;
