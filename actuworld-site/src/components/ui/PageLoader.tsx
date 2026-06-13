import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../Logo";

interface PageLoaderProps {
  isLoading: boolean;
}

export const PageLoader = ({ isLoading }: PageLoaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-aw-bg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo officiel : globe qui tourne + point en orbite */}
            <Logo size={84} spin orbit />

            <div className="flex flex-col items-center gap-3">
              <h2
                className="text-2xl font-bold text-aw-text tracking-tight"
                style={{ fontFamily: '"Platypi", Georgia, serif' }}
              >
                ActuWorld
              </h2>
              {/* Barre de progression indéterminée */}
              <div className="h-1 w-32 overflow-hidden rounded-full bg-aw-border">
                <motion.div
                  className="h-full w-1/2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--aw-primary), var(--aw-accent))",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
