"use client";

import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React, { useState } from "react";

interface StartPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}
export default function StarPicker({
  value = 0,
  onChange,
  disabled,
  className,
}: StartPickerProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className={cn("flex items-center", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-0.5 transition w-fit cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <StarIcon
            className={cn(
              "size-5 transition",
              !disabled && "hover:scale-120",
              (hoverValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black"
            )}
          />
        </button>
      ))}
    </div>
  );
}
