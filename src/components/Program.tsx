import React from "react";
import TitleBar from "./TitleBar";

interface ProgramProps {
   title: string;
   titleStyle?: string;
   titleIconSrc?: string;
   hasMinimizeButton?: any;
   isDraggable?: any;
   id?: string;
   className?: string;
   children?: JSX.Element;
}

const defaultProps: ProgramProps = {
   title: "",
   titleStyle: "bold",
   hasMinimizeButton: true,
   isDraggable: true,
   id: "",
   className: ""
}

const Program: React.FunctionComponent<ProgramProps> = (props: ProgramProps) => {
   return (
      <div id={props.id} className={`windows-program ${props.className}`}>
         <TitleBar titleIconSrc={props.titleIconSrc} titleStyle={props.titleStyle} title={props.title} hasMinimizeButton={props.hasMinimizeButton} isDraggable={props.isDraggable} />
         {props.children}
      </div>
   )
}

Program.defaultProps = defaultProps;

export default Program;
