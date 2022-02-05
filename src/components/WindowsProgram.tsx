import React, { Ref, useEffect, useRef } from "react";
import { dragElem } from "../utils";
import TitleBar from "./TitleBar";

type UIButtonType = "minimize" | "close";
interface ProgramProps {
   title: string;
   titleStyle?: string;
   titleIconSrc?: string;
   uiButtons?: ReadonlyArray<UIButtonType>;
   buttonsAreDark?: boolean;
   minimizeFunc?: () => void;
   closeFunc?: () => void;
   isDraggable?: boolean;
   id?: string;
   className?: string;
   children?: JSX.Element;
}

const defaultProps: ProgramProps = {
   title: "",
   titleStyle: "bold",
   uiButtons: ["minimize"],
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
      <TitleBar ref={titlebarRef} buttonsAreDark={props.buttonsAreDark} minimizeFunc={props.minimizeFunc} closeFunc={props.closeFunc} titleIconSrc={props.titleIconSrc} titleStyle={props.titleStyle} title={props.title} uiButtons={props.uiButtons || new Array<UIButtonType>()} isDraggable={props.isDraggable || false} />
      {props.children}
   </div>;
});

WindowsProgram.defaultProps = defaultProps;

export default WindowsProgram;
