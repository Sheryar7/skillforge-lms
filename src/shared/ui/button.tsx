import * as React from "react";
import Spinner from "../components/Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    const base = "px-6 py-4 rounded-2xl font-black text-sm tracking-tight transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-sm";
    
    const variants = {
      primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-100",
      secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
      danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/70",
      ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-none"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";