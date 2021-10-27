import React from "react";
import TitleBar from "./TitleBar";

interface ProgramProps {
   id?: string;
   className?: string;
   children?: JSX.Element;
}

const defaultProps: ProgramProps = {
   id: "",
   className: ""
}

const Program: React.FunctionComponent<ProgramProps> = (props: ProgramProps) => {
   return (
      <div id={props.id} className={`windows-program ${props.className}`}>
         <TitleBar title="lorem_counter.gov" hasMinimizeButton={false} />
         {props.children}
      </div>
   )
}

Program.defaultProps = defaultProps;

export default Program;
