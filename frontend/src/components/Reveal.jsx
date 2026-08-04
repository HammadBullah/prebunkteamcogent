import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Mask / curtain reveal — content slides up out of an overflow-hidden wrapper.
export function Reveal({ children, delay = 0, className = "", once = true, y = "110%" }) {
  return (
    <div className={`rv ${className}`}>
      <motion.div
        initial={{ y }}
        whileInView={{ y: 0 }}
        viewport={{ once, margin: "-12% 0px" }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Scale-into-place reveal for cards / blocks.
export function ScaleIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Gentle fade for secondary text blocks.
export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
