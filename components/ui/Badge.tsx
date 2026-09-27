import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  dotColor?: string;
  url?: string;
  logo?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  children?: React.ReactNode;
}

export function Badge({
  label,
  dotColor = "bg-emerald-400",
  url,
  logo,
  variant,
  className,
  children,
  ...props
}: BadgeProps) {
  if (variant === "outline") {
    const outlineBadge = (
      <span
        className={cn(
          "inline-flex items-center rounded-md border border-border/60 px-2 py-0.5 text-[11px] font-mono font-medium text-foreground/90 transition-colors",
          className
        )}
        {...props}
      >
        {children || label}
      </span>
    );

    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          {outlineBadge}
        </a>
      );
    }
    return outlineBadge;
  }

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 glass-pill text-foreground text-[11px] rounded-md font-medium",
        className
      )}
      {...props}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${label || ""} logo`}
          width={12}
          height={12}
          className="w-3 h-3 rounded-full object-contain shrink-0"
        />
      ) : dotColor ? (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
          aria-hidden="true"
        />
      ) : null}
      <span>{children || label}</span>
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return content;
}

