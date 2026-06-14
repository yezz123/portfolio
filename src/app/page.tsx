import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { LatestBlogsSection } from "@/components/sections/latest-blogs-section";
import {
  getFeaturedBlogPosts,
  getPersonalInfo,
  getPinnedProjects,
} from "@/lib/data";

export default async function Home() {
  const [personalInfo, projects, posts] = await Promise.all([
    getPersonalInfo(),
    getPinnedProjects(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <div>
      <HeroSection initialPersonalInfo={personalInfo} />
      <ProjectsSection initialProjects={projects} />
      <LatestBlogsSection initialPosts={posts} />
    </div>
  );
}
