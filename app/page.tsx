import { ProfileHero } from "@/components/profile/ProfileHero";
import { AboutSection } from "@/components/profile/AboutSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { EducationSection } from "@/components/education/EducationSection";
import { HackathonsSection } from "@/components/hackathons/HackathonsSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { GallerySection } from "@/components/gallery/GallerySection";
import { SocialLinksSection } from "@/components/social/SocialLinksSection";

export default function Home() {
  return (
    <main className="max-w-[620px] mx-auto px-5 sm:px-6 pt-8 pb-20 w-full">
      <ProfileHero />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <HackathonsSection />
      <ProjectsSection />
      <GallerySection />
      <SocialLinksSection />
    </main>
  );
}
