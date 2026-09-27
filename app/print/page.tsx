import type { Metadata } from "next";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { AboutSection } from "@/components/profile/AboutSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { EducationSection } from "@/components/education/EducationSection";
import { HackathonsSection } from "@/components/hackathons/HackathonsSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { GallerySection } from "@/components/gallery/GallerySection";
import { SocialLinksSection } from "@/components/social/SocialLinksSection";
import { GitHubActivitySection } from "@/components/github/GitHubActivitySection";
import { PrintFooter } from "@/components/print/PrintFooter";
import { PrintAutoTrigger } from "@/components/print/PrintAutoTrigger";

export const metadata: Metadata = {
  title: "Print Portfolio — Shreyansh Patni",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrintPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-slate-200">
      <PrintAutoTrigger />
      <main className="max-w-[760px] mx-auto px-6 pt-8 pb-12 w-full print-page-wrapper">
        <ProfileHero />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <HackathonsSection />
        <ProjectsSection />
        <GallerySection />
        <SocialLinksSection />
        <GitHubActivitySection />
        <PrintFooter />
      </main>
    </div>
  );
}
