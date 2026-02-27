import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import SolutionSection from "@/components/sections/SolutionSection";
import VoiceSection from "@/components/sections/VoiceSection";
import ImpactSection from "@/components/sections/ImpactSection";
import FutureSection from "@/components/sections/FutureSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-x-hidden custom-scrollbar"
    >
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main>
        {/* Section 1: Hero - The Problem */}
        <HeroSection />

        {/* Section 2: The Solution - Workflow */}
        <section id="solution">
          <SolutionSection />
        </section>

        {/* Section 3: Multilingual + Voice */}
        <section id="features">
          <VoiceSection />
        </section>


        {/* Section 5: Impact Visualization */}
        <section id="impact">
          <ImpactSection />
        </section>

        {/* Section 6: Future Scope */}
        <section id="roadmap">
          <FutureSection />
        </section>

        {/* Section 7: Final CTA */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global noise overlay */}
      <div className="fixed inset-0 pointer-events-none noise-overlay z-50" />
    </motion.div>
  );
};

export default Index;
