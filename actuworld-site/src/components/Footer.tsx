import { Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="py-10 border-t border-aw bg-aw-surface">
      <div className="max-w-7xl mx-auto container-px flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-aw-primary">
            <Globe2 className="w-4 h-4 text-white" />
          </span>
          <span className="body-semi">ActuWorld</span>
          <span className="caption text-aw-muted">© {year}</span>
        </div>
        <div className="flex items-center gap-4 caption text-aw-muted">
          <a href="#" className="hover:text-aw-primary transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-aw-primary transition-colors">Conditions</a>
          <a href="#" className="hover:text-aw-primary transition-colors">Presse</a>
        </div>
      </div>
    </footer>
  );
};
