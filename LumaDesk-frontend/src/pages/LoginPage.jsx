// src/pages/LoginPage.jsx
import * as React from 'react'; // 1. Import React to use useState
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import * as Form from '@radix-ui/react-form';
import { Link, useNavigate } from 'react-router-dom'; // navigate is already imported, good.
import NavBar from '../layouts/NavBar'; // Assuming path is correct
import Footer from '../layouts/Footer'; // Assuming path is correct

const LoginPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // 2. We only need login and isLoading from context. We'll handle the error locally.
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    // 3. THIS IS THE FIX: Create the local error state your handleSubmit needs
    const [loginError, setLoginError] = React.useState(null);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError(null); // This call now works!

        const success = await login(email, password);

        if (success) {
            navigate('/dashboard'); // This is perfect.
        } else {
            // This call also works now.
            setLoginError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <motion.div
                    className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <img
                            src="/assets/lumadesk-logo.png"
                            alt="LumaDesk Logo"
                            className="mx-auto mb-4 h-16 w-auto"
                        />
                        <p className="mt-2 text-stone-600">
                            Welcome back. Please log in to continue.
                        </p>
                    </div>

                    <Form.Root className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field (No changes) */}
                        <Form.Field className="relative" name="email">

                            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">

                                Email

                            </Form.Label>

                            <div className="relative">

                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">

                                    <Mail className="h-5 w-5 text-stone-400" />

                                </span>

                                <Form.Control asChild>

                                    <input

                                        type="email"

                                        value={email}

                                        onChange={(e) => setEmail(e.target.value)}

                                        required

                                        className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"

                                        placeholder="agent@lumadesk.com"

                                    />

                                </Form.Control>

                            </div>

                            <Form.Message

                                className="mt-2 text-sm text-rose-500"

                                match="valueMissing"

                            >

                                Please enter your email

                            </Form.Message>

                            <Form.Message

                                className="mt-2 text-sm text-rose-500"

                                match="typeMismatch"

                            >

                                Please enter a valid email address

                            </Form.Message>
                        </Form.Field>

                        {/* Password Field (No changes) */}
                        <Form.Field className="relative" name="password">
                            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">

                                Password

                            </Form.Label>

                            <div className="relative">

                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">

                                    <Lock className="h-5 w-5 text-stone-400" />

                                </span>

                                <Form.Control asChild>

                                    <input

                                        type="password"

                                        value={password}

                                        onChange={(e) => setPassword(e.target.value)}

                                        required

                                        className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"

                                        placeholder="••••••••"

                                    />

                                </Form.Control>

                            </div>

                            <Form.Message

                                className="mt-2 text-sm text-rose-500"

                                match="valueMissing"

                            >

                                Please enter your password

                            </Form.Message>
                        </Form.Field>

                        {/* 4. API Error Display: Point this to your new *local* error state */}
                        {loginError && (
                            <motion.div
                                className="flex items-center rounded-md bg-rose-50 p-3 text-sm text-rose-500"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                                {loginError}
                            </motion.div>
                        )}

                        {/* Submit Button (No changes) */}
                        <Form.Submit asChild>
                            <Form.Submit asChild>

                                <Button

                                    type="submit"

                                    className="w-full"

                                    variant="primary"

                                    disabled={isLoading}

                                >

                                    {isLoading ? (

                                        <motion.div

                                            animate={{ rotate: 360 }}

                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}

                                        >

                                            <Loader2 className="mr-2 h-4 w-4" />

                                        </motion.div>

                                    ) : (

                                        'Log In'

                                    )}

                                </Button>

                            </Form.Submit>
                        </Form.Submit>
                    </Form.Root>

                    <p className="mt-6 text-center text-sm text-stone-600">
                        Need an account?{' '}
                        <Link to="/register" className="font-medium text-amber-500 hover:text-amber-600">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;