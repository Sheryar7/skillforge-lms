"use client";

import { ChangeEvent, useState } from "react";
import clsx from "clsx";

interface InputProps {
    placeholder?: string;
    type?: string;
    label: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export default function Input({
    type = "text",
    label,
    value,
    onChange,
    error,
}: InputProps) {
    const [focused, setFocused] = useState(false);

    const isActive = focused || value;

    return (
        <div className="relative w-full mb-4">
            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={clsx(
                    "w-full px-3 pt-5 pb-2 rounded bg-gray-800 text-white border outline-none transition",
                    error ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                )}
            />

            <label
                className={clsx(
                    "absolute left-3 transition-all text-gray-400 pointer-events-none",
                    isActive ? "top-1 text-xs" : "top-3 text-sm"
                )}
            >
                {label}
            </label>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}