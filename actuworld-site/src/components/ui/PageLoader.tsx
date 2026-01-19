import { motion, AnimatePresence } from "framer-motion";
import { Globe2 } from "lucide-react";

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
            className="flex flex-col items-center gap-4"
          >
            {/* Logo animé */}
            <motion.div
              className="w-16 h-16 rounded-2xl bg-aw-primary flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Globe2 className="w-8 h-8 text-white" />
            </motion.div>

            {/* Texte */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-aw-text">ActuWorld</h2>
              <p className="text-sm text-aw-muted">Chargement...</p>
            </motion.div>

            {/* Barre de progression */}
            <motion.div className="w-48 h-1 bg-aw-surface rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-aw-primary via-aw-accent to-aw-secondary"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
