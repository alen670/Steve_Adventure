import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyles = "mc-font px-4 py-3 text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all uppercase text-white shadow-lg";
  
  const variants = {
    primary: "bg-green-600 border-green-800 hover:bg-green-500",
    secondary: "bg-stone-600 border-stone-800 hover:bg-stone-500",
    danger: "bg-red-600 border-red-800 hover:bg-red-500",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};