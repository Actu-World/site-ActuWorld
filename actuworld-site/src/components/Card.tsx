import React from 'react';

type Props = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
};

export const Card: React.FC<Props> = ({ icon: Icon, title, children }) => (
  <div className="card card-hover p-6">
    {Icon && (
      <div className="w-11 h-11 rounded-xl bg-aw-success flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-aw-primary" />
      </div>
    )}
    <h3 className="body-semi text-lg mb-2">{title}</h3>
    <p className="text-aw-muted text-sm leading-relaxed">{children}</p>
  </div>
);
