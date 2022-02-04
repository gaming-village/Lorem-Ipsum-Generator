import React, { Ref, useEffect, useRef } from "react";
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

const WindowsProgram = React.forwardRef((props: ProgramProps, ref: Ref<HTMLDivElement>) => {
   const titlebarRef = useRef(null);

   useEffect(() => {
      if (props.isDraggable) {
         dragElem((titlebarRef.current! as HTMLElement).parentElement!, titlebarRef.current!);
      }
   }, [props.isDraggable]);

   return <div ref={ref} id={props.id} className={`windows-program ${props.className}`}>
      <TitleBar ref={titlebarRef} minimizeFunc={props.minimizeFunc} titleIconSrc={props.titleIconSrc} titleStyle={props.titleStyle} title={props.title} hasMinimizeButton={props.hasMinimizeButton} isDraggable={props.isDraggable || false} />
      {props.children}
   </div>;
});

WindowsProgram.defaultProps = defaultProps;

export default WindowsProgram;
