import React from 'react';

type Props = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
};

export const Card: React.FC<Props> = ({ icon: Icon, title, children }) => (
  <div className="card p-6 h-full">
    {Icon && (
      <div className="w-10 h-10 rounded-[10px] bg-aw-success flex items-center justify-center mb-4" aria-hidden="true">
        <Icon className="w-5 h-5 text-aw-primary" />
      </div>
    )}
    <h3 className="text-lg mb-2">{title}</h3>
    <p className="text-aw-muted text-[15px] leading-relaxed">{children}</p>
  </div>
);
