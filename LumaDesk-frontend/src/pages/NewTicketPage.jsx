// src/pages/NewTicketPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllIssueCategories } from '../api/categoryService';
// --- 1. Import the new agent function ---
import { createCustomerTicket, createAgentTicket } from '../api/ticketService';
import { Button } from '../components/ui/Button';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Check,
  User, // --- 2. Add User icon ---
} from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import * as Form from '@radix-ui/react-form';
import { motion } from 'framer-motion';

// --- 3. Added a reusable FormField component to keep code DRY ---
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

const NewTicketPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [description, setDescription] = useState('');
  
  // --- 4. Add new state for the agent field ---
  const [customerUserId, setCustomerUserId] = useState('');
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- 5. Check user's role ---
  // You can expand this logic for other agent-like roles
  const isAgent = user?.role === 'ROLE_SUPPORT_AGENT';

  // 1. Fetch categories (no change)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsPageLoading(true);
        const response = await getAllIssueCategories();
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Could not load issue categories. Please try refreshing.');
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Handle the form submission (Now role-aware)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!selectedCategoryId) {
      setError('Please select an issue category.');
      return;
    }

    setIsSubmitting(true);

    const categoryObject = categories.find(
      (c) => c.categoryId.toString() === selectedCategoryId
    );

    if (!categoryObject) {
      setError('Invalid category selected.');
      setIsSubmitting(false);
      return;
    }

    // --- 6. Role-based DTO and API call ---
    try {
      if (isAgent) {
        // Build the Agent DTO
        const ticketData = {
          agentUserId: user.userId,
          customerUserId: parseInt(customerUserId, 10), // DTO needs a number
          issueCategory: {
            categoryId: categoryObject.categoryId,
            categoryName: categoryObject.categoryName,
          },
          issueDescription: description,
        };
        await createAgentTicket(ticketData);
      } else {
        // Build the Customer DTO (original logic)
        const ticketData = {
          customerUserId: user.userId,
          issueCategory: {
            categoryId: categoryObject.categoryId,
            categoryName: categoryObject.categoryName,
          },
          issueDescription: description,
        };
        await createCustomerTicket(ticketData);
      }
      
      setSuccess('Your ticket has been raised successfully!');
      // Clear the form
      setSelectedCategoryId('');
      setDescription('');
      setCustomerUserId(''); // Also clear the new field
      
    } catch (err) {
      console.error('Failed to create ticket:', err);
      // Check for specific API errors
      const errorMsg = err.response?.data?.message || 'A problem occurred while raising your ticket. Please try again.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Logic ---

  if (isPageLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="mb-6 text-3xl font-bold text-stone-800">
        Create a New Ticket
      </h1>
      {/* --- 7. Role-aware description --- */}
      <p className="mb-6 text-stone-600">
        {isAgent
          ? "Please fill in the customer's User ID and issue details below."
          : 'Please select an issue category and describe your problem.'}
      </p>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <Form.Root onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- 8. Conditional "Customer User ID" field --- */}
          {isAgent && (
            <FormField
              name="customerUserId"
              label="Customer User ID"
              icon={User}
              type="number"
              value={customerUserId}
              onChange={(e) => setCustomerUserId(e.target.value)}
              placeholder="Enter the Customer's User ID (e.g., 102)"
              required
            />
          )}
          
          {/* 1. Radix-UI Select for Category (No change) */}
          <Form.Field name="category" className="w-full">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              Issue Category
            </Form.Label>
            <Form.Control asChild>
              <Select.Root
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm outline-none placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                  <Select.Value placeholder="Select an issue category..." />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4" />
                  </Select.Icon>
                </Select.Trigger>
                
                <Select.Portal>
                  <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                    <Select.Viewport className="p-1">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <Select.Item
                            key={category.categoryId}
                            value={category.categoryId.toString()}
                            className="relative flex h-9 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 pl-8 text-sm text-stone-700 outline-none data-[highlighted]:bg-stone-100 data-[highlighted]:text-amber-600"
                          >
                            <Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                              <Check className="h-4 w-4" />
                            </Select.ItemIndicator>
                            <Select.ItemText>
                              {category.categoryName}
                            </Select.ItemText>
                          </Select.Item>
                        ))
                      ) : (
                        <Select.Item disabled className="p-2 text-sm text-stone-400">
                          No categories found.
                        </Select.Item>
                      )}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Control>
            <Form.Message
              className="mt-2 text-sm text-rose-500"
              match={(value) => !value}
            >
              Please select a category
            </Form.Message>
          </Form.Field>

          {/* 2. Text Area for Description (No change) */}
          <Form.Field name="description" className="w-full">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              Issue Description
            </Form.Label>
            <Form.Control asChild>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                placeholder="Please describe your issue in detail. e.g., 'My internet is down, and the router's light is blinking red.'"
              />
            </Form.Control>
            <Form.Message
              className="mt-2 text-sm text-rose-500"
              match="valueMissing"
            >
              Please enter a description
            </Form.Message>
          </Form.Field>

          {/* 3. Alerts and Submit Button (No change) */}
          {success && (
            <motion.div
              className="flex items-center rounded-md bg-lime-50 p-3 text-sm text-lime-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              className="flex items-center rounded-md bg-rose-50 p-3 text-sm text-rose-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <Form.Submit asChild>
            <Button
              type="submit"
              className="mt-2"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </motion.div>
  );
};

export default NewTicketPage;