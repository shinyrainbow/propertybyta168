"use client";

import * as React from "react";
import { X } from "lucide-react";

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within a Sheet");
  }
  return context;
}

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open: controlledOpen, onOpenChange, children }: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const handleOpenChange = onOpenChange || setUncontrolledOpen;

  return (
    <SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function SheetTrigger({ children, asChild, ...props }: SheetTriggerProps) {
  const { onOpenChange } = useSheet();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        onOpenChange(true);
        const childProps = children.props as { onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void };
        childProps.onClick?.(e);
      },
    } as any);
  }

  return (
    <button {...props} onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
}

export function SheetContent({ children, className = "", side = "bottom", ...props }: SheetContentProps) {
  const { open, onOpenChange } = useSheet();

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sideStyles = {
    bottom: "inset-x-0 bottom-0 rounded-t-2xl max-h-[85vh]",
    top: "inset-x-0 top-0 rounded-b-2xl",
    left: "inset-y-0 left-0 rounded-r-2xl w-3/4 max-w-sm",
    right: "inset-y-0 right-0 rounded-l-2xl w-3/4 max-w-sm",
  };

  const animationStyles = {
    bottom: open ? "translate-y-0" : "translate-y-full",
    top: open ? "translate-y-0" : "-translate-y-full",
    left: open ? "translate-x-0" : "-translate-x-full",
    right: open ? "translate-x-0" : "translate-x-full",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div
        className={`fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-out ${sideStyles[side]} ${animationStyles[side]} ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function SheetHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-between border-b border-gray-200 px-4 py-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SheetTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h2>
  );
}

export function SheetClose({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useSheet();

  return (
    <button
      className={`rounded-full p-1 hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      <X className="w-5 h-5" />
    </button>
  );
}
