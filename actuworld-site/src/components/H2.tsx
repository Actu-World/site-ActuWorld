import React from 'react';

type Props = {
  kicker?: string;
  children: React.ReactNode;
  center?: boolean;
  as?: 'h1' | 'h2';
  size?: 'md' | 'sm';
};

export const H2: React.FC<Props> = ({ kicker, children, center, as = 'h2', size = 'md' }) => {
  const Tag = as;
  const sizeClasses = size === 'sm' ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl';
  return (
    <div className={center ? 'text-center' : ''}>
      {kicker && (
        <p className="overline text-aw-primary mb-3">
          {kicker}
        </p>
      )}
      <Tag className={`${sizeClasses} font-bold leading-tight`}>
        {children}
      </Tag>
    </div>
  );
};
