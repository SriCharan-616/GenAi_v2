import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = true,
  shadow = 'md',
  rounded = 'xl',
  background = 'white',
  border = true,
  ...props 
}) => {
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl'
  };

  const roundedSizes = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl'
  };

  const backgrounds = {
    white: 'bg-white/90 backdrop-blur-sm',
    transparent: 'bg-transparent',
    gray: 'bg-gray-50/90 backdrop-blur-sm',
    blue: 'bg-blue-50/90 backdrop-blur-sm'
  };

  const baseClasses = `
    ${backgrounds[background]}
    ${shadows[shadow]}
    ${roundedSizes[rounded]}
    ${border ? 'border border-blue-100' : ''}
    ${hover ? 'hover:shadow-xl transform hover:scale-105 transition-all duration-300' : 'transition-shadow duration-200'}
    ${padding ? 'p-6' : ''}
    ${className}
  `.trim();

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;