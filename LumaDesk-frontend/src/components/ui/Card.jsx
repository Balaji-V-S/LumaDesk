import React from 'react'

export const Card = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'bg-white text-neutral-dark',
        'rounded-2xl', // Keep rounded-2xl for soft container
        'shadow-lg shadow-stone-900/5', // More subtle shadow
        'overflow-hidden border border-stone-200/60', // Subtle border
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  ),
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={['flex flex-col space-y-2 p-6', className].join(' ')} // Tighter space
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={['text-2xl font-semibold leading-none tracking-tight', className].join(' ')}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={['text-sm text-stone-500', className].join(' ')} // Lighter description
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={['p-6 pt-0', className].join(' ')}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={['flex items-center p-6 pt-0', className].join(' ')}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'