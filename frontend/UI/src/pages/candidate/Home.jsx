import HeroSection from "../../components/home/HeroSection.jsx";
import StatsSection from "../../components/home/StatsSection.jsx";
import PopularVacancies from "../../components/home/PopularVacancies.jsx";
import HowItWorks from "../../components/home/HowItWorks.jsx";
import FeaturedJobs from "../../components/home/FeaturedJobs.jsx";
import TopCompanies from "../../components/home/TopCompanies.jsx";
import HomeCTA from "../../components/home/HomeCTA.jsx";

// This is the candidate's landing page (CandidateRoutes redirects the bare
// "/candidate" index here). CandidateLayout already supplies the header/footer.
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <PopularVacancies />
      <HowItWorks />
      <FeaturedJobs />
      <TopCompanies />
      <HomeCTA />
    </div>
  );
}