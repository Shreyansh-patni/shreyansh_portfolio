import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { socialAccounts } from "@/content/social";
import { AboutSection } from "@/components/profile/AboutSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { EducationSection } from "@/components/education/EducationSection";
import { BusinessesSection } from "@/components/businesses/BusinessesSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SocialLinksSection } from "@/components/social/SocialLinksSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Developer and founder building software products, SaaS solutions, and media brands. Pursuing Computer Science & Engineering at PES University.",
  alternates: {
    canonical: "https://shreyansh.cc/about",
  },
  openGraph: {
    title: "About — Shreyansh Patni",
    description:
      "Developer and founder building software products, SaaS solutions, and media brands.",
    url: "https://shreyansh.cc/about",
  },
};

const jsonLdProfilePage = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "About Shreyansh Patni",
  url: "https://shreyansh.cc/about",
  mainEntity: {
    "@type": "Person",
    "@id": "https://shreyansh.cc#person",
    name: profile.name,
    url: "https://shreyansh.cc",
    image: "https://shreyansh.cc/images/profile/avatar.png",
    description: profile.about,
    jobTitle: "Developer & Founder",
    sameAs: socialAccounts.map((account) => account.url),
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "PES University",
      },
      {
        "@type": "EducationalOrganization",
        name: "Gujarat Technological University",
      },
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "Sahaya",
        url: "https://sahaya.tech",
      },
      {
        "@type": "Organization",
        name: "th3.media",
        url: "https://th3.media",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-[620px] mx-auto px-5 sm:px-6 pt-10 pb-20 w-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdProfilePage),
          }}
        />
      </head>

      {/* Top Back Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none group-hover:-translate-x-0.5 transition-transform"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to profile</span>
        </Link>
      </div>

      {/* Page Header */}
      <header className="mb-10">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground font-medium mb-3">
          ABOUT
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          {profile.name}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground font-normal">
          {profile.shortBio}
        </p>
      </header>

      {/* Sections Sequence */}
      <div className="space-y-2">
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <BusinessesSection />
        <ProjectsSection />
        <SocialLinksSection />
      </div>

      {/* Bottom Back Link */}
      <div className="pt-8 mt-10 border-t border-border/40">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[13px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none group-hover:-translate-x-0.5 transition-transform"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to profile</span>
        </Link>
      </div>
    </main>
  );
}
