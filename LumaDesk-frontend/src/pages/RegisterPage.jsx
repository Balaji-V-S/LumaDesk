// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        pinCode: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // For general API errors
    const [formErrors, setFormErrors] = useState({}); // For field-specific errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.fullName) errors.fullName = 'Full name is required';
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        // Add more validation as needed (e.g., phone, pincode format)
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
            // Create a payload without the 'confirmPassword' field
            const { confirmPassword, ...payload } = formData;

            // Endpoint URL: /auth/register (Update as needed)
            const response = await axiosInstance.post('/auth/register', payload);

            // --- SUCCESS ---
            console.log('Registration successful:', response.data);

            // Navigate to login page with a success message (optional)
            navigate('/login?registered=true');

        } catch (err) {
            // --- ERROR ---
            console.error('Registration failed:', err);
            if (err.response && err.response.status === 409) {
                // Example: Conflict, email already exists
                setError('An account with this email already exists.');
                setFormErrors({ email: 'This email is already taken' });
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF9F6] p-4">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <Link to="/">
                    <img
                        className="mx-auto h-18 w-auto"
                        src="/assets/lumadesk-logo.png"
                        alt="Lumadesk Logo"
                    />
                </Link>

                <h2 className="mt-6 text-center text-2xl font-semibold text-slate-800">
                    Create your account
                </h2>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow-lg"
                >
                    {/* General Error Message */}
                    {error && (
                        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 px-2">
                        <div className="sm:col-span-2">
                            <Input
                                label="Full name"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                error={formErrors.fullName}
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <Input
                                label="Email address"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={formErrors.email}
                                required
                            />
                        </div>

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={formErrors.confirmPassword}
                            required
                        />

                        <Input
                            label="Phone number"
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={formErrors.phoneNumber}
                        />

                        <Input
                            label="Pincode"
                            id="pinCode"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleChange}
                            error={formErrors.pinCode}
                        />

                        <div className="sm:col-span-2">
                            <Input
                                label="Address"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                error={formErrors.address}
                            />
                        </div>
                    </div>

                    <Button type="submit" isLoading={isLoading}>
                        Create account
                    </Button>
                </form>
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </p>
        </div>
    );
}