import React from 'react';

type Props = {
  kicker?: string;
  children: React.ReactNode;
  center?: boolean;
  as?: 'h1' | 'h2';
};

export const H2: React.FC<Props> = ({ kicker, children, center, as = 'h2' }) => {
  const Tag = as;
  return (
    <div className={center ? 'text-center' : ''}>
      {kicker && (
        <p className="overline text-aw-primary mb-3">
          {kicker}
        </p>
      )}
      <Tag className="text-3xl md:text-4xl font-bold leading-tight">
        {children}
      </Tag>
    </div>
  );
};
