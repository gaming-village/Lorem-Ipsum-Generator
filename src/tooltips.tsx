import ReactDOM from "react-dom";
import { getElem } from "./utils";

interface TooltipPosition {
   readonly top?: string;
   readonly right?: string;
   readonly bottom?: string;
   readonly left?: string;
}

export function createTooltip(position: TooltipPosition, content: JSX.Element): HTMLElement {
   const tooltip = document.createElement("div");
   tooltip.className = "tooltip";
   getElem("root").appendChild(tooltip);

   for (const pos of Object.entries(position)) {
      tooltip.style[pos[0] as any] = pos[1];
   }

   ReactDOM.render(content, tooltip);

   return tooltip;
}
export function removeTooltip(tooltip: HTMLElement): void {
   tooltip.remove();
}