import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SoundProvider } from "@/components/site/sound-context";
import { IntroProvider } from "@/components/site/intro-context";

import { HeroNavigation } from "@/components/site/hero/HeroNavigation";
import { Hero } from "@/components/site/Hero";
import { RealmMap } from "@/components/site/RealmMap";
import { AboutSection } from "@/components/site/AboutSection";
import { ChroniclesTimeline } from "@/components/site/ChroniclesTimeline";
import { CampaignsSection } from "@/components/site/CampaignsSection";
import { ForgeSkills } from "@/components/site/ForgeSkills";
import { ResumeSection } from "@/components/site/ResumeSection";
import { GithubSection } from "@/components/site/GithubSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { ParticleBackground } from "@/components/site/ParticleBackground";
import { BranOracle } from "@/components/site/bran/BranOracle";

const title = "Sumit Singh — Software Engineer";
const description =
  "Sumit Singh — Software Engineer specializing in backend systems, APIs, AI-powered products, and modern web applications.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SoundProvider>
      <IntroProvider>
        <div className="relative min-h-screen overflow-x-hidden">
          <HeroNavigation />
          <main>
            <Hero />
            <div className="relative">
              <ParticleBackground density={14} className="fixed inset-0 opacity-60" />
              <div className="relative">
                <RealmMap />
                <AboutSection />
                <ChroniclesTimeline />
                <CampaignsSection />
                <ForgeSkills />
                <ResumeSection />
                <GithubSection />
                <ContactSection />
              </div>
            </div>
          </main>
          <BranOracle />
          <Footer />
          <Toaster />
        </div>
      </IntroProvider>
    </SoundProvider>
  );
}

