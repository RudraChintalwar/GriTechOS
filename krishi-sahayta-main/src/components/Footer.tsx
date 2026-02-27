import { motion } from "framer-motion";
import { Leaf, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-card/50" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start justify-between">
          {/* Logo & About */}
          <div className="flex flex-col gap-4">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-display text-foreground">
                GriTech OS
              </span>
            </motion.div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Intelligent scheme discovery platform for India's farmers.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <motion.a
                href="https://github.com/RudraChintalwar/GriTechOS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Team Members */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground">Our Team</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Rudra Chintalwar</li>
              <li>Atharva Ghongade</li>
              <li>Atharv Raut</li>
              <li>Shweta Rupnawar</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground">Contact Us</h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:rudrachintalwar@gmail.com"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                rudrachintalwar@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/rudra-chintalwar-b66087332/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground">Links</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/RudraChintalwar/GriTechOS/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                About Project
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 GriTech OS. Built for Cybage TechFest by PICT AI & DS Students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
