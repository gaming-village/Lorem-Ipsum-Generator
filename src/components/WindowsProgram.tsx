import React, { Ref, RefObject, useEffect, useRef } from "react";
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
   startsAtTopLeft?: boolean;
   id?: string;
   className?: string;
   style?: React.CSSProperties;
   children?: JSX.Element | Array<JSX.Element>;
}

const defaultProps: ProgramProps = {
   title: "",
   titleStyle: "bold",
   uiButtons: [],
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

      if (props.startsAtTopLeft) {
         const elem = (ref as RefObject<HTMLDivElement>).current!;
         elem.style.top = "0";
         elem.style.left = "0";
      }
   }, [props.isDraggable, props.startsAtTopLeft, ref]);

   return <div ref={ref} style={props.style} id={props.id} className={`windows-program ${props.className}`}>
      <TitleBar ref={titlebarRef} buttonsAreDark={props.buttonsAreDark} minimizeFunc={props.minimizeFunc} closeFunc={props.closeFunc} iconSrc={props.titleIconSrc} titleStyle={props.titleStyle} title={props.title} uiButtons={props.uiButtons || new Array<UIButtonType>()} isDraggable={props.isDraggable || false} />
      {props.children}
   </div>;
});

WindowsProgram.defaultProps = defaultProps;

export default WindowsProgram;
