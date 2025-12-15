import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "gold" | "navy" | "glass" | "dark-outline" | "dark-ghost";
  size?: "default" | "sm" | "lg" | "xl";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]/50 disabled:pointer-events-none disabled:opacity-50";

    const variantStyles = {
      default: "bg-[#111928] text-white hover:bg-[#1F2937] rounded-xl",
      outline: "border-2 border-[#E5E7EB] bg-transparent hover:border-[#C9A227] hover:text-[#C9A227] rounded-xl",
      ghost: "hover:bg-gray-100 rounded-xl",
      gold: "bg-gradient-to-r from-[#9A7B06] via-[#8A6B05] to-[#7A5B04] text-white hover:from-[#C9A227] hover:via-[#B8960B] hover:to-[#9A7B06] rounded-xl font-semibold",
      navy: "bg-[#111928] text-white hover:bg-[#1F2937] rounded-xl",
      glass: "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl",
      "dark-outline": "border-2 border-white/20 bg-transparent text-white hover:border-[#C9A227] hover:text-[#C9A227] rounded-xl",
      "dark-ghost": "text-white hover:bg-white/10 rounded-xl",
    };

    const sizeStyles = {
      default: "h-11 px-5 py-2 text-sm",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      xl: "h-14 px-8 text-base",
    };

    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
