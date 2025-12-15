"use client";

import * as React from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value: string;
  label: string;
  onValueChange: (value: string, label: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setLabel: (label: string) => void;
}>({
  value: "",
  label: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  setLabel: () => {},
});

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prevValueRef = React.useRef(value);

  const handleValueChange = React.useCallback((newValue: string, newLabel: string) => {
    setLabel(newLabel);
    onValueChange(newValue);
  }, [onValueChange]);

  // Reset label when value changes externally (e.g., reset filters)
  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      setLabel(""); // Reset so SelectItem can set the correct label
      prevValueRef.current = value;
    }
  }, [value]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // Use capture phase to ensure we catch the event before any other handlers
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [open]);

  // Close dropdown when pressing Escape
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <SelectContext.Provider value={{ value, label, onValueChange: handleValueChange, open, setOpen, setLabel }}>
      <div ref={containerRef} className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children }: SelectTriggerProps) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between rounded-md border bg-white text-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { label } = React.useContext(SelectContext);
  return <span className="text-gray-900">{label || placeholder}</span>;
}

export function SelectContent({ children, className = "" }: SelectContentProps) {
  const { open } = React.useContext(SelectContext);

  return (
    <div
      className={`absolute z-100 mt-1 w-full rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg ${
        open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      } ${className}`}
    >
      <div className="p-1 max-h-60 overflow-y-auto">{children}</div>
    </div>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen, setLabel, label } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return getTextContent(props.children);
      }
    }
    return "";
  };

  // Sync label when this item is selected (for pre-set values from URL params)
  React.useEffect(() => {
    if (isSelected && !label) {
      setLabel(getTextContent(children));
    }
  }, [isSelected, label, setLabel, children]);

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-gray-900 ${
        isSelected ? "bg-gray-100 font-medium" : ""
      }`}
      onClick={() => {
        onValueChange(value, getTextContent(children));
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}

export function SelectSeparator() {
  return <div className="my-1 h-px bg-gray-200" />;
}

export function SelectLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </div>
  );
}
