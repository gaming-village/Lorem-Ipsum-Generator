import React, { MouseEventHandler, useEffect, useRef } from "react"
import { createTooltip, removeTooltip } from "../tooltips";

interface ButtonProps {
   id?: string;
   className?: string;
   onClick?: MouseEventHandler;
   isCentered?: boolean;
   isFlashing?: boolean;
   isDark?: boolean;
   children: JSX.Element | string;
   tooltipContent?: () => JSX.Element;
}

/** A standardized button. Should only be used for non-custom buttons */
const Button = (props: ButtonProps) => {
   const ref = useRef<HTMLButtonElement>(null);
   const tooltip = useRef<HTMLElement | null>(null);

   const hoverTooltip = (): HTMLElement => {
      const buttonBounds = ref.current!.getBoundingClientRect();
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
   return (
      <button onMouseOver={shouldHover ? () => hoverTooltip() : undefined} onMouseOut={shouldHover ? () => closeTooltip() : undefined} ref={ref} onClick={props.onClick} id={props.id} className={`button${props.className ? " " + props.className : ""}${props.isCentered ? " centered" : ""}${props.isFlashing ? " flashing" : ""}${props.isDark ? " dark" : ""}`}>
         {props.children}
      </button>
   );
}

export default Button;
