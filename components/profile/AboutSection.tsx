import {
  profile as defaultProfile,
  type Profile,
  type AboutSegment,
} from "@/content/profile";

interface AboutSectionProps {
  profile?: Profile;
}

export function AboutSection({ profile = defaultProfile }: AboutSectionProps) {
  return (
    <section className="mb-14" data-purpose="about-section">
      <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight mb-3">
        About
      </h2>
      <p className="text-[14px] sm:text-[15px] leading-relaxed text-muted-foreground font-normal">
        {profile.aboutSegments.map((segment: AboutSegment, index: number) => {
          if (segment.type === "highlight") {
            return (
              <span
                key={index}
                className="underline underline-offset-4 font-medium text-foreground decoration-muted-foreground/60"
              >
                {segment.value}
              </span>
            );
          }
          return <span key={index}>{segment.value}</span>;
        })}
      </p>
    </section>
  );
}
