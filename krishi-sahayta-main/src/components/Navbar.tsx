import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ctaLink = user ? "/app" : "/auth";
  const ctaLabel = user ? t("nav.dashboard") : t("nav.getStarted");

  const navItems = [
    { label: t("nav.solution"), href: "#solution" },
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.impact"), href: "#impact" },
    { label: t("nav.roadmap"), href: "#roadmap" },
  ];

  return (
    <>
      <motion.nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled ? 'py-4' : 'py-6'}
        `}
      >
        <motion.div
          className="absolute inset-0 glass-card border-0"
          style={{ opacity: bgOpacity }}
        />

        <div className="relative container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold font-display text-foreground">
                GriTech OS
              </span>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            {/* Language + CTA */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector variant="compact" />
              <Link to={ctaLink}>
                <motion.button
                  className="btn-hero py-2 px-6 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {ctaLabel}
                </motion.button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSelector variant="compact" />
              <motion.button
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden"
        initial={false}
        animate={isOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
        <div className="relative h-full flex flex-col items-center justify-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="text-2xl font-display font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </motion.a>
          ))}
          <Link to={ctaLink} onClick={() => setIsOpen(false)}>
            <motion.button
              className="btn-hero mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
            >
              {ctaLabel}
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
