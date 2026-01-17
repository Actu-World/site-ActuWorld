import React from 'react';

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  container?: boolean;
};
export const Section: React.FC<Props> = ({ id, className = '', children, container = true }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className={container ? 'max-w-7xl mx-auto container-px' : ''}>{children}</div>
    </section>
  );
};
