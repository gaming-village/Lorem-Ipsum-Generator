import React, { forwardRef, MouseEventHandler, Ref, RefObject, useEffect, useRef } from "react"
import { createTooltip, removeTooltip } from "../tooltips";

interface ButtonProps {
   id?: string;
   className?: string;
   onClick?: MouseEventHandler;
   isCentered?: boolean;
   isFlashing?: boolean;
   isDotted?: boolean;
   isDark?: boolean;
   children: JSX.Element | string | undefined;
   tooltipContent?: () => JSX.Element;
}

/** A standardized button. Should only be used for non-custom buttons */
const Button = forwardRef((props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
   const tooltip = useRef<HTMLElement | null>(null);

   const hoverTooltip = (): HTMLElement => {
      const buttonBounds = (ref as RefObject<HTMLButtonElement>).current!.getBoundingClientRect();
      const pos = {
         left: buttonBounds.left + buttonBounds.width * 0.75 + "px",
         top: buttonBounds.top + buttonBounds.height / 2 + "px"
      }

      tooltip.current = createTooltip(pos, props.tooltipContent!());
      return tooltip.current;
   }

   const closeTooltip = () => {
      if (tooltip.current !== null) {
         removeTooltip(tooltip.current);
         tooltip.current = null;
      }
   }

   useEffect(() => {
      return () => {
         if (tooltip.current !== null) removeTooltip(tooltip.current);
      }
   }, [tooltip]);

   const shouldHover = typeof props.tooltipContent !== "undefined";
   return <button onMouseOver={shouldHover ? () => hoverTooltip() : undefined} onMouseOut={shouldHover ? () => closeTooltip() : undefined} ref={ref} onClick={props.onClick} id={props.id} className={`button${props.className ? " " + props.className : ""}${props.isCentered ? " centered" : ""}${props.isFlashing ? " flashing" : ""}${props.isDark ? " dark" : ""}${props.isDotted ? " dotted" : ""}`}>
      {props.children}
   </button>;
});

export default Button;
