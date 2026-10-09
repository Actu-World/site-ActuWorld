import React from 'react';

type Props = {
  /** Sur-titre : 1 pour 3 sections maximum (DESIGN.md §3) */
  kicker?: string;
  children: React.ReactNode;
  center?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
};

export const H2: React.FC<Props> = ({ kicker, children, center, as = 'h2', className = '' }) => {
  const Tag = as;
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      {kicker && <p className="eyebrow mb-4">{kicker}</p>}
      <Tag className="text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.12] tracking-[-0.015em] font-bold text-aw-text">
        {children}
      </Tag>
    </div>
  );
};
