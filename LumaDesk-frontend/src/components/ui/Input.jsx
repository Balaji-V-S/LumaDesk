import React from 'react'

export const Input = React.forwardRef(
  ({ className, type = 'text', ...props }, ref) => {
    const inputClasses = [
      'flex h-10 w-full',
      'border border-stone-300 bg-white',
      'px-3 py-2 text-sm text-neutral-dark placeholder:text-stone-400',
      'rounded-md', // Sharper corners
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', // Branded focus ring
      'transition-all duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    ].join(' ')

    return (
      <input
        type={type}
        className={inputClasses}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'