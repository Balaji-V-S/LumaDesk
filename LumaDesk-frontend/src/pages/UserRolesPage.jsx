// src/pages/UserRolesPage.jsx
import React, { useState } from 'react';
import { changeRole } from '../api/authService';
import { Button } from '../components/ui/Button';
import { Loader2, User, Shield, Check, ChevronDown } from 'lucide-react';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// The list of all roles you provided
const allRoles = [
  'ROLE_CUSTOMER',
  'ROLE_SUPPORT_AGENT',
  'ROLE_TRIAGE_OFFICER',
  'ROLE_TECH_SUPPORT_ENGINEER',
  'ROLE_NOC_ENGINEER',
  'ROLE_FIELD_ENGINEER',
  'ROLE_TEAM_LEAD',
  'ROLE_MANAGER',
  'ROLE_NOC_ADMIN',
  'ROLE_CXO'
];

// Reusable Select Item (same as from SlaFormModal)
const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className="relative flex h-9 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 pl-8 text-sm text-stone-700 outline-none data-[highlighted]:bg-stone-100 data-[highlighted]:text-amber-600"
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Check className="h-4 w-4" />
      </Select.ItemIndicator>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
});

const UserRolesPage = () => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const roleData = {
      userId: parseInt(userId, 10),
      role: role,
    };

    const promise = changeRole(roleData);

    toast.promise(promise, {
      loading: 'Updating user role...',
      success: () => {
        setIsSubmitting(false);
        // Clear form on success
        setUserId('');
        setRole('');
        return `Role for User #${roleData.userId} updated to ${roleData.role}!`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'Failed to change role. Check the User ID.';
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl font-bold text-stone-800 mb-6">
        User Role Management
      </h1>
      
      <div className="max-w-xl rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-stone-800">
          Change a User's Role
        </h3>
        <p className="mt-1 text-sm text-stone-600">
          Enter a User ID and select a new role to assign.
        </p>
        
        <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* User ID Field */}
          <Form.Field name="userId">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              User ID
            </Form.Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <User className="h-5 w-5 text-stone-400" />
              </span>
              <Form.Control asChild>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., 102"
                  required
                  className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </Form.Control>
            </div>
          </Form.Field>

          {/* Role Dropdown */}
          <Form.Field name="role">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              New Role
            </Form.Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Shield className="h-5 w-5 text-stone-400" />
              </span>
              <Select.Root value={role} onValueChange={setRole} required>
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 px-3 pl-10 text-sm">
                  <Select.Value placeholder="Select a role..." />
                  <ChevronDown />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                    <Select.Viewport className="p-1">
                      {allRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </Form.Field>

          {/* Submit Button */}
          <div className="pt-2">
            <Form.Submit asChild>
              <Button type="submit" variant="accent" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Role
              </Button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </motion.div>
  );
};

export default UserRolesPage;