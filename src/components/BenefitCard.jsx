import React from 'react';

const BenefitCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-[hsl(var(--card))] border-l-4 border-l-primary border-y-[hsl(var(--primary)/0.1)] border-r-[hsl(var(--primary)/0.1)] border hover:border-primary transition-all duration-300 hover:-translate-y-1 group rounded-lg">
      <div className="p-6">
        <div className="mb-5 inline-flex p-3 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors duration-300">
          <Icon className="h-6 w-6 text-primary group-hover:text-black" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 font-heading">
          {title}
        </h3>
        <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BenefitCard;
