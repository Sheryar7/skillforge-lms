// components/ui/Spinner.tsx
"use client";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      {/* Reduced size to h-5 w-5 to fit inside a standard button */}
      <div className="relative h-5 w-5">
        {/* Background track - semi-transparent white to look good on purple */}
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        
        {/* The moving "active" part - solid white for contrast */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-white border-r-white"></div>
      </div>
    </div>
  );
}