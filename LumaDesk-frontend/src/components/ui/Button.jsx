import { CgSpinner } from 'react-icons/cg'; // Install: npm install react-icons

export default function Button({ 
  children, 
  type = 'submit', 
  isLoading = false, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyle = "w-full flex justify-center rounded-lg px-5 py-3 text-base font-medium shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-white text-indigo-600 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:ring-indigo-500",
  };

  return (
    <button
      type={type}
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-xl" />
      ) : (
        children
      )}
    </button>
  );
}