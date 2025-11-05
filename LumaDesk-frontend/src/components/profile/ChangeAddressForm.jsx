// src/components/profile/ChangeAddressForm.jsx
import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { changeAddress } from '../../api/userService';
import { Button } from '../ui/Button';
import { Loader2, AlertCircle, CheckCircle, MapPin, Home, Target } from 'lucide-react';
import { motion } from 'framer-motion';

// A reusable Form Field component for this page
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

// Reusable alert component
const Alert = ({ variant, message }) => {
  const isError = variant === 'error';
  const colors = isError
    ? 'bg-rose-50 text-rose-600'
    : 'bg-lime-50 text-lime-700';
  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <motion.div
      className={`mt-4 flex items-center rounded-md p-3 text-sm ${colors}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
      {message}
    </motion.div>
  );
};

export const ChangeAddressForm = ({ user }) => {
  const [address, setAddress] = useState(user.address || '');
  const [area, setArea] = useState(user.area || '');
  const [pinCode, setPinCode] = useState(user.pinCode || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const addressData = {
      userId: user.userId,
      address,
      area,
      pinCode,
    };

    try {
      await changeAddress(addressData);
      setSuccess('Address updated successfully!');
      // TODO: Optionally update the user in AuthContext
    } catch (err) {
      setError('Failed to update address. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-stone-800">
        Update Your Address
      </h3>
      <Form.Root className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <FormField
          name="address"
          label="Address"
          icon={Home}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            name="area"
            label="Area"
            icon={MapPin}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
          <FormField
            name="pinCode"
            label="Pin Code"
            icon={Target}
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            required
          />
        </div>

        {success && <Alert variant="success" message={success} />}
        {error && <Alert variant="error" message={error} />}

        <Form.Submit asChild>
          <Button
            type="submit"
            className="mt-4"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};