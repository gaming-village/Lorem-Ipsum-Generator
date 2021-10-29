import React from "react"

interface ButtonProps {
   id?: string;
   className?: string;
   text: string;
}

const Button = (props: ButtonProps) => {
   return (
      <button id={props.id} className={`button ${props.className}`}>
         {props.text}
      </button>
   )
}

export default Button;
