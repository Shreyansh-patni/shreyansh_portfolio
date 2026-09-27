import React from "react";
import { aboutData as defaultAboutData, type AboutContent } from "@/content/about";

interface AboutSectionProps {
  data?: AboutContent;
}

export function AboutSection({ data = defaultAboutData }: AboutSectionProps) {
  return (
    <section className="mb-14" data-purpose="about-section">
      <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-4">
        About
      </h2>

      {/* Intro Paragraphs */}
      <div className="space-y-3.5 mb-8">
        {data.intro.map((paragraph, pIdx) => (
          <p
            key={pIdx}
            className="text-[14px] sm:text-[15px] leading-relaxed text-muted-foreground font-normal"
          >
            {paragraph.map((segment, sIdx) => {
              if (segment.link) {
                return (
                  <a
                    key={sIdx}
                    href={segment.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 font-medium text-foreground hover:text-accent decoration-muted-foreground/60 transition-colors"
                  >
                    {segment.text}
                  </a>
                );
              }
              if (segment.highlight) {
                return (
                  <span
                    key={sIdx}
                    className="underline underline-offset-4 font-medium text-foreground decoration-muted-foreground/60"
                  >
                    {segment.text}
                  </span>
                );
              }
              return <span key={sIdx}>{segment.text}</span>;
            })}
          </p>
        ))}
      </div>

      {/* Subsections Stack */}
      <div className="space-y-7">
        {/* Currently */}
        <div>
          <h3 className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            Currently
          </h3>
          <ul className="space-y-2 text-[13.5px] text-muted-foreground leading-relaxed font-normal">
            {data.currently.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-foreground/60 select-none">•</span>
                <span>
                  {item.text}
                  {item.linkUrl && item.linkText && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 font-medium text-foreground hover:text-accent transition-colors"
                    >
                      {item.linkText}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interests */}
        <div>
          <h3 className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            Interests
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono text-muted-foreground">
            {data.interests.map((interest, idx) => (
              <React.Fragment key={interest}>
                {idx > 0 && (
                  <span className="text-muted-foreground/40 select-none">·</span>
                )}
                <span className="px-2 py-0.5 glass-pill rounded-md text-foreground/90 font-medium">
                  {interest}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
