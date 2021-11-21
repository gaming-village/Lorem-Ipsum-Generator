import React, { MouseEventHandler } from "react"

interface ButtonProps {
   id?: string;
   className?: string;
   onClick?: MouseEventHandler;
   isCentered?: boolean;
   text: string;
}

const Button = (props: ButtonProps) => {
   return (
      <button onClick={props.onClick} id={props.id} className={`button ${props.className} ${props.isCentered ? "centered" : ""}`}>
         {props.text}
      </button>
   )
}

export default Button;
