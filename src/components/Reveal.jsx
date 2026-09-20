// src/components/Reveal.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/* Fades a block in with a tiny upward move the first time it scrolls into view. */
function Reveal({ children, delay = 0, y = 16, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
