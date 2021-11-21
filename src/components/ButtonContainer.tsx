import React from "react";

interface ButtonContainerProps {
   children: JSX.Element;
}

const ButtonContainer = (props: ButtonContainerProps) => {
   return (
      <div className="button-container">
         {props.children}
      </div>
   )
}

export default ButtonContainer;
