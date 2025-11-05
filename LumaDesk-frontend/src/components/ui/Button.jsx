// src/components/ui/Button.jsx
import * as React from 'react';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';

// Define variant styles based on our palette
const buttonVariants = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-white',
  accent: 'bg-rose-500 hover:bg-rose-600 text-white',
  secondary: 'bg-lime-400 hover:bg-lime-500 text-neutral-dark',
  ghost: 'hover:bg-stone-100 text-stone-800',
};

const Button = React.forwardRef(
  (
    { className, variant = 'primary', asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? motion(Slot) : motion.button;
    
    return (
      <Comp
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
        ref={ref}
        whileTap={{ scale: 0.95 }}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };