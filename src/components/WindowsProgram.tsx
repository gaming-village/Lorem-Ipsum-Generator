import React from "react";
import TitleBar from "./TitleBar";

interface ProgramProps {
   title: string;
   titleStyle?: string;
   titleIconSrc?: string;
   hasMinimizeButton: boolean;
   minimizeFunc?: () => void;
   isDraggable?: boolean;
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

const WindowsProgram: React.FunctionComponent<ProgramProps> = (props: ProgramProps) => {
   return (
      <div id={props.id} className={`windows-program ${props.className}`}>
         <TitleBar minimizeFunc={props.minimizeFunc} titleIconSrc={props.titleIconSrc} titleStyle={props.titleStyle} title={props.title} hasMinimizeButton={props.hasMinimizeButton} isDraggable={props.isDraggable || false} />
         {props.children}
      </div>
   )
}

WindowsProgram.defaultProps = defaultProps;

export default WindowsProgram;
