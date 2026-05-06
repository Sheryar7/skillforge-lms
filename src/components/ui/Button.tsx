"use client";

import clsx from "clsx";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  text,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const base =
    "w-full py-2 rounded text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-95";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button onClick={onClick} className={clsx(base, variants[variant])}>
      {text}
    </button>
  );
}