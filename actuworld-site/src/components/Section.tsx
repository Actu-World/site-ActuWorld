import React from 'react';

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  container?: boolean;
  /** Largeur du conteneur : contenu éditorial (6xl, défaut) ou large (7xl) */
  width?: 'default' | 'wide';
};

export const Section: React.FC<Props> = ({ id, className = '', children, container = true, width = 'default' }) => {
  // Rythme vertical par défaut, sauf si la page fournit le sien
  const spacing = /(^|\s)(py|pt|pb)-/.test(className) ? '' : 'py-16 md:py-28';
  const max = width === 'wide' ? 'max-w-7xl' : 'max-w-6xl';
  return (
    <section id={id} className={`${spacing} ${className}`}>
      <div className={container ? `${max} mx-auto container-px` : ''}>{children}</div>
    </section>
  );
};
