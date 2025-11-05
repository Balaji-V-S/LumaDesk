import React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

export const Label = React.forwardRef(
  ({ className, ...props }, ref) => {
    const labelClasses = [
      'text-sm font-medium text-stone-700 leading-none', // Slightly darker text
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    ].join(' ')
    
    return (
      <LabelPrimitive.Root
        ref={ref}
        className={labelClasses}
        {...props}
      />
    )
  }
)
Label.displayName = LabelPrimitive.Root.displayName