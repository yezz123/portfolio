import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { LatestBlogsSection } from "@/components/sections/latest-blogs-section";

export default async function Home() {
  return (
    <div>
      <HeroSection />
      <ProjectsSection />
      <LatestBlogsSection />
    </div>
  );
}
