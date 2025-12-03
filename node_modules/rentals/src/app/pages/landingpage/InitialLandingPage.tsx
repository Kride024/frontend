// apps/rentals/src/app/pages/InitialLandingPage.tsx
import Navbar from "../../shared/components/Navbar/Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./InitialAboutView";
import CommunityCarousel from "./CommunityCarousel";
import WcuSection from "./InitialWCUView";
import TestimonialsView from "../landingpage/Testimonials/TestimonialsView"
import FooterSection from "./FooterSection";

const InitialLandingPage: React.FC = () => {
  return (
    <>
       <Navbar /> 
      <HeroSection />
      <AboutSection />
      <CommunityCarousel />
      <WcuSection />
       <TestimonialsView />
      <FooterSection />
    </>
  );
};

export default InitialLandingPage;