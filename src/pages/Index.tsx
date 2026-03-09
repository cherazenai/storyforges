import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <HeroSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Forge Your Story</span>?
            </h2>
            <p className="text-silver/60 mb-8 max-w-lg mx-auto">
              Join thousands of writers using AI to craft unforgettable worlds and characters.
            </p>
            <Link
              to="/generators"
              className="btn-primary-gradient px-8 py-3.5 rounded-lg inline-flex items-center gap-2 font-semibold"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 relative z-10">
        <div className="container max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 StoryForge. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/generators" className="hover:text-foreground transition-colors">Generators</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
