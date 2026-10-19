import { Suspense } from "react";
import AboutSection from "@/features/landing/components/AboutSection";
import ExploreOpportunities from "@/features/landing/components/ExploreOpportunities";
import LandingFooter, {
  LandingFooterFallback,
} from "@/features/landing/components/LandingFooter";
import LandingHero from "@/features/landing/components/LandingHero";
import LandingNavbar from "@/features/landing/components/LandingNavbar";
import RecruiterSection from "@/features/landing/components/RecruiterSection";
import StudentJourney from "@/features/landing/components/StudentJourney";

export default function LandingPageView() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <ExploreOpportunities />
        <StudentJourney />
        <RecruiterSection />
        <AboutSection />
      </main>
      <Suspense fallback={<LandingFooterFallback />}>
        <LandingFooter />
      </Suspense>
    </div>
  );
}
