import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-600 text-white hover:brightness-110 focus:ring-primary/50 shadow-sm",
    secondary: "bg-surface text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500/50 shadow-sm",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500/50",
    danger: "bg-error text-white hover:brightness-110 focus:ring-error/50 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;