import React from "react";
import {
  socialAccounts as defaultSocialAccounts,
  type SocialAccount,
} from "@/content/social";

interface SocialLinksSectionProps {
  items?: SocialAccount[];
}

export function SocialLinksSection({
  items = defaultSocialAccounts,
}: SocialLinksSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-14" data-purpose="social-links-section">
      <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
        SOCIAL
      </div>
      <div className="space-y-3">
        {items.map((account) => (
          <a
            key={account.id}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface border border-border/60 hover:border-border transition-all"
          >
            <span className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">
              {account.platform}
            </span>
            <div className="flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
              <span>{account.username || account.label}</span>
              <svg
                className="w-3.5 h-3.5 text-muted-foreground/70 stroke-current fill-none group-hover:text-foreground transition-colors"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
