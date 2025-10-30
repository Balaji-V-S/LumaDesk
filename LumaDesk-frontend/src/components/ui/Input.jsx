import React from 'react';

const Input = React.forwardRef((
  { type = 'text', label, id, name, error, ...props }, 
  ref
) => {
  return (
    <div>
      <label 
        htmlFor={id || name} 
        className="block text-sm font-medium leading-6 text-slate-700"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id || name}
          name={name}
          type={type}
          ref={ref}
          {...props}
          className={`
            block w-full rounded-md border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300
            placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
            transition-all duration-150
            ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 focus:ring-indigo-600'}
          `}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
});

export default Input;