import React from "react";

export interface TimelineProps {
  children: React.ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return <div className="space-y-7">{children}</div>;
}
