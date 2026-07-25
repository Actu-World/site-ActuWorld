import { motion } from "framer-motion";

interface LogoProps {
  /** Taille du sigle (globe) en pixels */
  size?: number;
  /** Afficher le mot « ActuWorld » à côté du sigle */
  withText?: boolean;
  /** Rotation 3D continue du globe (utilisé sur le loader) */
  spin?: boolean;
  /** Point d'accent en orbite autour du globe */
  orbit?: boolean;
  /** Halo lumineux derrière le sigle */
  glow?: boolean;
  className?: string;
  textClassName?: string;
}

/**
 * Logo officiel ActuWorld (sigle globe `public/logo.svg`) avec micro-animations.
 * Remplace l'ancienne icône générique `Globe2` utilisée dans la navbar / footer / loader.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 36,
  withText = false,
  spin = false,
  orbit = false,
  glow = true,
  className = "",
  textClassName = "",
}) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <motion.span
        className="relative inline-flex items-center justify-center shrink-0"
        style={{ width: size, height: size, perspective: 800 }}
        whileHover={{ scale: 1.08, rotate: -4 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 14 }}
      >
        {/* Halo d'accent */}
        {glow && (
          <span
            aria-hidden="true"
            className="absolute inset-[-15%] rounded-full blur-md opacity-50"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, var(--aw-accent), transparent 70%)",
            }}
          />
        )}

        {/* Sigle officiel */}
        <motion.img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          width={size}
          height={size}
          style={{ width: size, height: size, transformStyle: "preserve-3d" }}
          className="relative drop-shadow-sm"
          animate={spin ? { rotateY: [0, 360] } : undefined}
          transition={
            spin ? { duration: 6, repeat: Infinity, ease: "linear" } : undefined
          }
        />

        {/* Point d'accent en orbite */}
        {orbit && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-[-5px] pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: Math.max(4, size * 0.13),
                height: Math.max(4, size * 0.13),
                background: "var(--aw-accent)",
                boxShadow: "0 0 8px var(--aw-accent)",
              }}
            />
          </motion.span>
        )}
      </motion.span>

      {withText && (
        <span
          className={`font-bold tracking-tight ${textClassName}`}
          style={{ fontFamily: '"Platypi", Georgia, serif' }}
        >
          ActuWorld
        </span>
      )}
    </span>
  );
};
