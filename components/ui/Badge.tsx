import React from "react";
import Image from "next/image";

export interface BadgeProps {
  label: string;
  dotColor?: string;
  url?: string;
  logo?: string;
}

export function Badge({
  label,
  dotColor = "bg-emerald-400",
  url,
  logo,
}: BadgeProps) {
  const content = (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface border border-border text-foreground text-[11px] rounded-md font-medium">
      {logo ? (
        <Image
          src={logo}
          alt={`${label} logo`}
          width={12}
          height={12}
          className="w-3 h-3 rounded-full object-contain shrink-0"
        />
      ) : (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
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
