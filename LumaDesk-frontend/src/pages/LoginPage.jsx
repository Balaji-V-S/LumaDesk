// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext'; // <-- 1. UNCOMMENT THIS

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- 2. UNCOMMENT THIS

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] =useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', formData);

      // --- 3. THIS IS THE CHANGE ---
      // Pass the full API response to our context
      login(response.data); 
      
      // Redirect to the dashboard
      navigate('/dashboard'); 

    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- The rest of the file is unchanged ---
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/">
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/lumadesk-logo.png"
            alt="Lumadesk Logo"
          />
        </Link>
        
        <h2 className="mt-6 text-center text-2xl font-semibold text-slate-800">
          Sign in to your account
        </h2>

        <form 
          onSubmit={handleSubmit} 
          className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow-lg"
        >
          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            required
          />

          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            required
          />

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link 
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}