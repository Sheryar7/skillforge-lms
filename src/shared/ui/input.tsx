"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

// Explicitly add the custom label prop alongside standard HTML input rules
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    // Determine the underlying input element's active rendering type
    const activeType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5 w-full">
        {/* Render the label automatically if passed into the component props */}
        {label && (
          <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 block">
            {label}
          </label>
        )}
        
        <div className="relative w-full flex items-center">
          <input
            type={activeType}
            className={`w-full p-4 bg-white border-2 border-slate-100 text-slate-900 placeholder-slate-400 rounded-2xl font-medium text-sm outline-none focus:border-violet-500 transition-all ${
              isPasswordType ? "pr-12" : ""
            } ${className || ""}`}
            ref={ref}
            {...props}
          />
          
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none select-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };