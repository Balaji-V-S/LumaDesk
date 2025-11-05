// src/components/profile/ResetPasswordForm.jsx
import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { resetPassword } from '../../api/authService';
import { Button } from '../ui/Button';
import { Loader2, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

// We can reuse the same helper components
const FormField = ({ name, label, icon: Icon, ...props }) => (
   <Form.Field name={name} className="w-full">
    <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
      {label}
    </Form.Label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <Icon className="h-5 w-5 text-stone-400" />
      </span>
      <Form.Control asChild>
        <input
          type="password"
          className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          {...props}
        />
      </Form.Control>
    </div>
    <Form.Message
      className="mt-2 text-sm text-rose-500"
      match="valueMissing"
    >
      Please enter your {label.toLowerCase()}
    </Form.Message>
  </Form.Field>
);

const Alert = ({ variant, message }) => {
  // ... (Same Alert component as in ChangeAddressForm)
  const isError = variant === 'error';
  const colors = isError ? 'bg-rose-50 text-rose-600' : 'bg-lime-50 text-lime-700';
  const Icon = isError ? AlertCircle : CheckCircle;
  return (
    <motion.div className={`mt-4 flex items-center rounded-md p-3 text-sm ${colors}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
      {message}
    </motion.div>
  );
};


export const ResetPasswordForm = ({ user }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const passwordData = {
      email: user.email,
      oldPassword,
      newPassword,
    };

    try {
      await resetPassword(passwordData);
      setSuccess('Password reset successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Failed to reset password. Check your old password.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-stone-800">
        Reset Your Password
      </h3>
      <Form.Root className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <FormField
          name="oldPassword"
          label="Old Password"
          icon={Lock}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <FormField
          name="newPassword"
          label="New Password"
          icon={Lock}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        {success && <Alert variant="success" message={success} />}
        {error && <Alert variant="error" message={error} />}

        <Form.Submit asChild>
          <Button
            type="submit"
            className="mt-4"
            variant="accent" // Use accent color for security actions
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Reset Password
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};