// src/pages/ManageEmployeePage.jsx
import React, { useState } from 'react';
import { setEmployeeDetails } from '../api/userService';
import { Button } from '../components/ui/Button';
import { Loader2, User, Briefcase, Users } from 'lucide-react';
import * as Form from '@radix-ui/react-form';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// A simple reusable form field component for this page
const FormField = ({ name, label, icon: Icon, type = 'text', ...props }) => (
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
          type={type}
          className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          {...props}
        />
      </Form.Control>
    </div>
    <Form.Message
      className="mt-2 text-sm text-rose-500"
      match="valueMissing"
    >
      Please enter a {label.toLowerCase()}
    </Form.Message>
  </Form.Field>
);

const ManageEmployeePage = () => {
  const [userId, setUserId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const detailsData = {
      userId: parseInt(userId, 10),
      employeeId: employeeId,
      teamId: teamId,
    };

    const promise = setEmployeeDetails(detailsData);

    toast.promise(promise, {
      loading: 'Updating employee details...',
      success: () => {
        setIsSubmitting(false);
        // Clear form on success
        setUserId('');
        setEmployeeId('');
        setTeamId('');
        return `Details for User #${detailsData.userId} updated!`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'Failed to update details. Check the User ID.';
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold text-stone-800 mb-6">
        Manage Employee
      </h1>
      
      <div className="max-w-xl rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-stone-800">
          Set Employee Details
        </h3>
        <p className="mt-1 text-sm text-stone-600">
          Update an employee's internal Employee ID and Team ID.
        </p>
        
        <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <FormField
            name="userId"
            label="User ID"
            icon={User}
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g., 102"
            required
          />

          <FormField
            name="employeeId"
            label="Employee ID"
            icon={Briefcase}
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g., E-405"
            required
          />

          <FormField
            name="teamId"
            label="Team ID"
            icon={Users}
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="e.g., T-NOC-01"
            required
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Form.Submit asChild>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Details
              </Button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </motion.div>
  );
};

export default ManageEmployeePage;