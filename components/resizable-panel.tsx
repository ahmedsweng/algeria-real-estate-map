"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ResizablePanelProps {
  children: React.ReactNode;
  side: "left" | "right";
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResizablePanel({
  children,
  side,
  defaultWidth = 400,
  minWidth = 300,
  maxWidth = 600,
  className,
  isOpen = false,
  onOpenChange,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(defaultWidth);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  // Handle resize
  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isDragging) return;

      let newWidth;
      if (side === "left") {
        newWidth = startWidthRef.current + (startXRef.current - e.clientX);
      } else {
        newWidth = startWidthRef.current + (e.clientX - startXRef.current);
      }

      // Clamp width between min and max
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(newWidth);
    };

    const handleResizeEnd = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isDragging, minWidth, maxWidth, side]);

  // Handle open/close
  useEffect(() => {
    if (isOpen) {
      setWidth(defaultWidth);
    }
  }, [isOpen, defaultWidth]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed top-0 h-full bg-background border-border shadow-lg transition-transform z-50",
        side === "left" ? "left-0 border-r" : "right-0 border-l",
        !isOpen && (side === "left" ? "-translate-x-full" : "translate-x-full"),
        className
      )}
      style={{ width: `${width}px` }}
    >
      {children}
      <div
        className={cn(
          "absolute top-0 w-1 h-full cursor-ew-resize hover:bg-primary/20 active:bg-primary/40",
          side === "left" ? "right-0" : "left-0"
        )}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}
