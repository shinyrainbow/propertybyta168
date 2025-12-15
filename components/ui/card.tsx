import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated" | "glass" | "dark" | "dark-bordered" | "dark-elevated";
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", hover = false, ...props }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-200";

    const variantStyles = {
      default: "bg-white border border-gray-100",
      bordered: "bg-white border-2 border-gray-200",
      elevated: "bg-white shadow-lg shadow-gray-200/50",
      glass: "backdrop-blur-md bg-white/80 border border-white/20",
      dark: "bg-[#1F2937] border border-white/10",
      "dark-bordered": "bg-[#1a2332] border-2 border-white/20",
      "dark-elevated": "bg-[#1F2937] shadow-lg shadow-black/30",
    };

    const hoverStyles = hover
      ? variant.startsWith("dark")
        ? "hover:border-[#C9A227]/50 cursor-pointer"
        : "hover:border-[#C9A227]/30 hover:shadow-lg hover:shadow-gray-200/50 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };
