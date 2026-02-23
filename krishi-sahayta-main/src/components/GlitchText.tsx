import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface GlitchTextProps {
  texts: string[];
  className?: string;
  delay?: number;
}

const GlitchText = ({ texts, className = "", delay = 0 }: GlitchTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setIsGlitching(false);
        }, 300);
      }, 3000);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [texts.length, delay]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ 
            opacity: isGlitching ? [1, 0.5, 1, 0.3, 1] : 1, 
            y: 0, 
            filter: "blur(0px)",
            x: isGlitching ? [0, -5, 5, -3, 0] : 0,
          }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-primary/50"
            animate={{ x: [-2, 2, -2], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.1, repeat: 3 }}
          >
            {texts[currentIndex]}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-accent/50"
            animate={{ x: [2, -2, 2], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.1, repeat: 3 }}
          >
            {texts[currentIndex]}
          </motion.span>
        </>
      )}
    </div>
  );
};

export default GlitchText;
