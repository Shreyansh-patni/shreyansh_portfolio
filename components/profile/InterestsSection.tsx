"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { interestGroups as defaultGroups, type InterestGroup } from "@/content/interests";

interface InterestsSectionProps {
  groups?: InterestGroup[];
}

export function InterestsSection({ groups = defaultGroups }: InterestsSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleGroup = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const activeGroup = groups.find((g) => g.id === activeId);

  return (
    <div>
      <h3 className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground mb-3 font-medium">
        Interests
      </h3>

      {/* Primary Interest Badges */}
      <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono">
        {groups.map((group) => {
          const isActive = activeId === group.id;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={isActive}
              aria-controls={`sub-interests-${group.id}`}
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
            >
              <Badge
                variant="outline"
                className={
                  isActive
                    ? "bg-foreground text-background border-foreground font-semibold cursor-pointer select-none"
                    : "bg-transparent text-foreground/85 hover:text-foreground hover:bg-muted/40 hover:border-foreground/30 cursor-pointer select-none transition-colors"
                }
              >
                {group.label}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Sub-Interests Animated Panel */}
      <AnimatePresence mode="wait">
        {activeGroup && (
          <motion.div
            id={`sub-interests-${activeGroup.id}`}
            key={activeGroup.id}
            initial={shouldReduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={shouldReduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: "easeInOut" }
            }
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              {activeGroup.subInterests.map((subInterest) => (
                <span
                  key={subInterest}
                  className="inline-flex items-center rounded-md border border-border/40 bg-muted/20 px-2 py-0.5 text-muted-foreground/90 transition-colors"
                >
                  {subInterest}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
