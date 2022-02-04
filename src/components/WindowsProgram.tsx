import React, { useEffect, useRef } from "react";
import { dragElem } from "../utils";
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
   const programRef = useRef(null);
   const titlebarRef = useRef(null);

   useEffect(() => {
      if (props.isDraggable) {
         dragElem(programRef.current!, titlebarRef.current!);
      }
   }, [props.isDraggable]);

   return <div ref={programRef} id={props.id} className={`windows-program ${props.className}`}>
      <TitleBar ref={titlebarRef} minimizeFunc={props.minimizeFunc} titleIconSrc={props.titleIconSrc} titleStyle={props.titleStyle} title={props.title} hasMinimizeButton={props.hasMinimizeButton} isDraggable={props.isDraggable || false} />
      {props.children}
   </div>;
}

WindowsProgram.defaultProps = defaultProps;

export default WindowsProgram;
