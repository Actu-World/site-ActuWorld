import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sur téléphone, le bouton masquerait le texte pendant la lecture :
    // il n'apparaît que lorsqu'on remonte la page
    const mobile = window.matchMedia("(max-width: 767px)");
    let lastY = window.scrollY;
    const toggleVisibility = () => {
      const y = window.scrollY;
      const goingUp = y < lastY - 2;
      const goingDown = y > lastY + 2;
      if (goingUp || goingDown) lastY = y;
      if (y <= 500) setIsVisible(false);
      else if (!mobile.matches) setIsVisible(true);
      else if (goingUp) setIsVisible(true);
      else if (goingDown) setIsVisible(false);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 w-11 h-11 rounded-xl border border-aw-strong bg-aw-bg text-aw-text flex items-center justify-center hover:border-aw-primary hover:text-aw-primary"
          style={{ boxShadow: "var(--aw-shadow-sm)" }}
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
