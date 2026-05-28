"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:opacity-90 active:opacity-80",
  secondary:
    "bg-bg-surface text-text-primary border border-[0.5px] border-border-default hover:bg-bg-primary",
  ghost:
    "bg-transparent text-text-primary hover:bg-bg-surface",
  whatsapp:
    "bg-whatsapp text-white hover:opacity-90 active:opacity-80",
  outline:
    "bg-white text-text-primary border border-[0.5px] border-border-default hover:border-accent hover:text-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-12 py-8 text-[12px]",
  md: "px-24 py-[10px] text-[13px]",
  lg: "px-32 py-16 text-[14px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-8 font-medium rounded-btn transition-opacity cursor-pointer select-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-border focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
