import React from "react";
import TitleBar from "./TitleBar";

interface ProgramProps {
   title: string;
   hasMinimizeButton?: any;
   id?: string;
   className?: string;
   children?: JSX.Element;
}

const defaultProps: ProgramProps = {
   title: "",
   hasMinimizeButton: true,
   id: "",
   className: ""
}

const Program: React.FunctionComponent<ProgramProps> = (props: ProgramProps) => {
   return (
      <div id={props.id} className={`windows-program ${props.className}`}>
         <TitleBar title={props.title} hasMinimizeButton={props.hasMinimizeButton} />
         {props.children}
      </div>
   )
}

Program.defaultProps = defaultProps;

export default Program;
