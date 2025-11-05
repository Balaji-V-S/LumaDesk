// src/pages/RegisterPage.jsx
import * as React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Home,
  MapPin,
  Target,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { registerUser } from '../api/authService';
import NavBar from '../layouts/NavBar';
import Footer from '../layouts/Footer';

//
// --- THE FIX (PART 1) ---
// Move FormField *outside* of RegisterPage.
// It's now its own component and won't be re-created on every render.
//
const FormField = ({
  name,
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange, // <-- THE FIX (PART 2): Accept onChange as a prop
}) => (
  <div className="relative">
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-stone-700"
    >
      {label}
    </label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <Icon className="h-5 w-5 text-stone-400" />
      </span>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange} // <-- THE FIX (PART 2): Use the prop here
        required
        placeholder={placeholder}
        className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
        autoComplete="off" // Good for preventing password manager clutter
      />
    </div>
  </div>
);

const RegisterPage = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    area: '',
    pinCode: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1000); // 1 second is a bit fast, but okay
    } catch (err) {
      const errorMsg =
        err.response?.data || 'An unknown error occurred during registration.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // FormField is no longer defined here

  return (
    <div>
        <NavBar/>
    <div className="flex min-h-screen items-center justify-center bg-stone-50 py-12">
      <motion.div
        className="w-full max-w-lg rounded-lg bg-white p-8 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          {/* Assuming you have this logo, if not, the Ticket icon works too */}
          <img
            src="/assets/lumadesk-logo.png"
            alt="LumaDesk Logo"
            className="mx-auto mb-4 h-16 w-auto"
          />
          <h1 className="text-3xl font-bold text-stone-800">
            Create your LumaDesk Account
          </h1>
          <p className="mt-2 text-stone-600">Join the network. Get support.</p>
        </div>

        {!success ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  name="fullName"
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={User}
                  value={formData.fullName}
                  onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
                />
              </div>
              <div className="sm:col-span-2">
                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
                />
              </div>
              <div className="sm:col-span-2">
                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
                />
              </div>
              <FormField
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="+91-xxxxxxxxxx"
                icon={Phone}
                value={formData.phoneNumber}
                onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
              />
              <FormField
                name="pinCode"
                label="Pin Code"
                type="text"
                placeholder="600001"
                icon={Target}
                value={formData.pinCode}
                onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
              />
              <div className="sm:col-span-2">
                <FormField
                  name="address"
                  label="Address"
                  type="text"
                  placeholder="1234 Main St"
                  icon={Home}
                  value={formData.address}
                  onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
                />
              </div>
              <div className="sm:col-span-2">
                <FormField
                  name="area"
                  label="Area"
                  type="text"
                  placeholder="Your Neighborhood"
                  icon={MapPin}
                  value={formData.area}
                  onChange={handleChange} // <-- THE FIX (PART 2): Pass the handler
                />
              </div>
            </div>

            {error && (
              <motion.div
                className="flex items-center rounded-md bg-rose-50 p-3 text-sm text-rose-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: 'linear',
                  }}
                >
                  {/* The Loader2 icon should be inside the spinning div,
                      but the text should be next to it.
                      Let's fix that layout slightly. */}
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4" />
                    Processing...
                  </span>
                </motion.div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        ) : (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CheckCircle className="mx-auto h-12 w-12 text-lime-500" />
            <h2 className="mt-4 text-2xl font-semibold text-stone-800">
              Registration Successful!
            </h2>
            <p className="mt-2 text-stone-600">
              Your account has been created. Redirecting you to the login page...
            </p>
            <Button asChild variant="ghost" className="mt-4">
              <Link to="/login">Go to Login Now</Link>
            </Button>
          </motion.div>
        )}

        {!success && (
          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-amber-500 hover:text-amber-600"
            >
              Log in
            </Link>
          </p>
        )}
      </motion.div>
    </div>
    <Footer/>
    </div>
  );
};

export default RegisterPage;