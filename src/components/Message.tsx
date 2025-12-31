import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React from "react";
import { Button } from "./ui/button";

interface MessageProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
}
export default function Message({
  children,
  className,
  onClick,
  text,
  disabled,
}: MessageProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="elevated"
          className={className}
          disabled={disabled}
          onClick={() => onClick?.()}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
