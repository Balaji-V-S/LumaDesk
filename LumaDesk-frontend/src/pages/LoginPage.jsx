// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

// This redirect map is great. We'll use it.
const roleRedirects = {
  ROLE_CUSTOMER: '/dashboard/customer',
  ROLE_SUPPORT_AGENT: '/dashboard/support-agent',
  ROLE_TRIAGE_OFFICER: '/dashboard/triage',
  ROLE_TECH_SUPPORT_ENGINEER: '/dashboard/tech-support',
  ROLE_NOC_ENGINEER: '/dashboard/noc-engineer',
  ROLE_FIELD_ENGINEER: '/dashboard/field',
  ROLE_TEAM_LEAD: '/dashboard/team-lead',
  ROLE_MANAGER: '/dashboard/manager',
  ROLE_NOC_ADMIN: '/dashboard/admin/noc',
  ROLE_CXO: '/dashboard/cxo',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- 🎨 THIS IS THE CORRECTED FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // ✅ API call
      const response = await axiosInstance.post('/auth/login', formData);
      
      // ✅ response.data is { token, userId, role, fullName }
      
      // ✅ 1. Pass the entire response.data to your context
      login(response.data);

      // ✅ 2. Get the role directly from the response data
      const { role } = response.data;
      
      // ✅ 3. Find the correct redirect path
      const redirectPath = roleRedirects[role]; // Default to home
      // ✅ 4. Navigate to the role-specific dashboard
      navigate(redirectPath);

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

  return (
    // Note: bg-[#FAF9F6] is fine, but redundant if it's on the <body>
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/">
          <img
            className="mx-auto h-16 w-auto" // Corrected from h-18 to h-16
            src="/assets/lumadesk-logo.png"
            alt="Lumadesk Logo"
          />
        </Link>

        <h2 className="mt-6 text-center text-2xl font-semibold text-slate-800">
          Sign in to your account
        </h2>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow-lg"
        >
          {/* Error Message */}
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

          {/* Forgot Password Link - Removed as per your code */}

          <Button type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Don’t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}