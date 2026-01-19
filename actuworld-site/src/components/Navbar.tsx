import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, Mail, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/app", label: "L'App" },
    { href: "/reco-src", label: "ASV" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/faq", label: "FAQ" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass border-b border-aw">
      <div className="max-w-7xl mx-auto container-px h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg md:text-xl">
          <motion.span
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-aw-primary"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Globe2 className="w-5 h-5 text-white" />
          </motion.span>
          <span className="text-aw-text">ActuWorld</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-[15px]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative transition-colors font-medium ${
                isActive(link.href)
                  ? 'text-aw-primary'
                  : 'text-aw-muted hover:text-aw-primary'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-aw-primary rounded-full"
                />
              )}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary text-sm px-4 py-2">
            <Mail className="w-4 h-4 mr-2" /> Contact
          </Link>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className="ml-2 w-9 h-9 rounded-lg border border-aw flex items-center justify-center hover:bg-aw-surface transition-colors"
            aria-label="Basculer thème"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            onClick={toggleTheme}
            className="p-2 text-aw-text"
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          <button
            className="p-2 text-aw-text"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-aw overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-3">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={`block py-2 transition-colors font-medium ${
                      isActive(link.href)
                        ? 'text-aw-primary'
                        : 'text-aw-muted hover:text-aw-primary'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link
                  to="/contact"
                  className="btn-primary text-sm px-4 py-2 text-center block"
                  onClick={() => setMobileOpen(false)}
                >
                  <Mail className="w-4 h-4 mr-2 inline" /> Contact
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
