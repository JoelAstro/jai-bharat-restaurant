import React from 'react';

export const VegBadge: React.FC<{ isVeg: boolean; className?: string }> = ({
  isVeg,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center border p-[2px] rounded-sm bg-white shadow-xs ${
        isVeg ? 'border-emerald-600' : 'border-rose-600'
      } ${className}`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isVeg ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      />
    </div>
  );
};
