import { ReactNode, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Placement = "left" | "right" | "top" | "bottom";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: Placement;
  delay?: number;
  className?: string;
}

export default function Tooltip({ children, content, placement = "left", delay = 100, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  let timeout: ReturnType<typeof setTimeout>;

  const show = () => {
    timeout = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timeout);
    setOpen(false);
  };

  const getPosition = () => {
    if (!triggerRef.current) return { top: 0, left: 0, transform: 'none' };
    const rect = triggerRef.current.getBoundingClientRect();
    const offset = 12; // Aumenté el offset para más separación
    console.log('Trigger rect:', rect); // Temporal para depurar
    switch (placement) {
      case "left":
        return { 
          top: rect.top + rect.height / 2, 
          left: rect.left - offset, 
          transform: 'translate(-100%, -50%)', // Centra el tooltip a la izquierda
          transformOrigin: 'right center' 
        };
      case "right":
        return { 
          top: rect.top + rect.height / 2, 
          left: rect.right + offset, 
          transform: 'translate(0, -50%)', 
          transformOrigin: 'left center' 
        };
      case "top":
        return { 
          top: rect.top - offset, 
          left: rect.left + rect.width / 2, 
          transform: 'translate(-50%, -100%)', 
          transformOrigin: 'bottom center' 
        };
      case "bottom":
        return { 
          top: rect.bottom + offset, 
          left: rect.left + rect.width / 2, 
          transform: 'translate(-50%, 0)', 
          transformOrigin: 'top center' 
        };
      default:
        return { 
          top: rect.top + rect.height / 2, 
          left: rect.left - offset, 
          transform: 'translate(-100%, -50%)', 
          transformOrigin: 'right center' 
        };
    }
  };

  const tooltip = (
    <div
      className={clsx("pointer-events-none", open ? "opacity-100" : "opacity-0", "transition-opacity duration-150")}
      style={{ position: "fixed", ...getPosition(), zIndex: 9999 }}
    >
      <div
        className={clsx(
          "bg-white text-[#1f2937] px-4 py-2 rounded-lg shadow-lg border border-gray-100 text-sm max-w-xs",
          className
        )}
        role="tooltip"
      >
        <div className="relative">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        {/* Arrow */}
        <div
          className={clsx(
            "absolute w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45 shadow-sm",
            placement === "left" && "-right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2",
            placement === "right" && "-left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            placement === "top" && "bottom-[-6px] left-1/2 -translate-x-1/2",
            placement === "bottom" && "top-[-6px] left-1/2 -translate-x-1/2"
          )}
          aria-hidden
        />
      </div>
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {typeof document !== "undefined" && open
        ? createPortal(tooltip, document.body)
        : null}
    </div>
  );
}