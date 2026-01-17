import React from 'react';

type Props = { kicker?: string; children: React.ReactNode; center?: boolean };

export const H2: React.FC<Props> = ({ kicker, children, center }) => (
  <div className={center ? 'text-center' : ''}>
    {kicker && (
      <p className="overline text-aw-primary mb-3">
        {kicker}
      </p>
    )}
    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
      {children}
    </h2>
  </div>
);
