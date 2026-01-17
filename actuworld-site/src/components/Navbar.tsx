import { useState } from 'react';
import { Globe2, Mail, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#app", label: "L'App" },
    { href: "#ai-tool", label: "Outil IA" },
    { href: "#features", label: "Fonctionnalités" },
    { href: "#business", label: "Tarifs" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-aw">
      <div className="max-w-7xl mx-auto container-px h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 font-bold text-lg md:text-xl">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-aw-primary">
            <Globe2 className="w-5 h-5 text-white" />
          </span>
          <span className="text-aw-text">ActuWorld</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-[15px]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-aw-muted hover:text-aw-primary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary text-sm px-4 py-2">
            <Mail className="w-4 h-4 mr-2" /> Contact
          </a>
          <button
            onClick={() => setDark((d) => {
              const root = document.documentElement;
              if (d) root.classList.remove('dark'); else root.classList.add('dark');
              return !d;
            })}
            className="ml-2 w-9 h-9 rounded-lg border border-aw flex items-center justify-center hover:bg-aw-surface transition-colors"
            aria-label="Basculer thème"
            title="Thème clair/sombre"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-aw-text"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-aw">
          <nav className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-aw-muted hover:text-aw-primary transition-colors font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="btn-primary text-sm px-4 py-2 text-center"
              onClick={() => setMobileOpen(false)}
            >
              <Mail className="w-4 h-4 mr-2 inline" /> Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
