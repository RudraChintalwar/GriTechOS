import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowing?: boolean;
  onClick?: () => void;
}

const FloatingCard = ({ 
  children, 
  className = "", 
  delay = 0,
  glowing = false,
  onClick 
}: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
      }}
      onClick={onClick}
      className={`
        glass-card cursor-pointer
        transition-all duration-500 ease-out
        ${glowing ? 'glow-border pulse-glow' : ''}
        ${className}
      `}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.1), transparent 50%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Bottom glow line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-gradient-to-r from-transparent via-primary to-transparent"
        whileHover={{ width: '80%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FloatingCard;
