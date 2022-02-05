import React, { MouseEventHandler } from "react"

interface ButtonProps {
   id?: string;
   className?: string;
   onClick?: MouseEventHandler;
   isCentered?: boolean;
   children: JSX.Element | string;
   isFlashing?: boolean;
}

const Button = (props: ButtonProps) => {
   return (
      <button onClick={props.onClick} id={props.id} className={`button${props.className ? " " + props.className : ""}${props.isCentered ? " centered" : ""}${props.isFlashing ? " flashing" : ""}`}>
         {props.children}
      </button>
   )
}

export default Button;
