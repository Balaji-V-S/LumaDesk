// src/components/admin/IssueCategoryFormModal.jsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { createIssueCategory, updateIssueCategory } from '../../api/categoryService';
import { toast } from 'sonner';

const IssueCategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
  const isEditMode = !!category;
  
  // Form state
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setCategoryName(category.categoryName);
    } else {
      setCategoryName('');
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let promise;

    if (isEditMode) {
      const updateData = {
        categoryId: category.categoryId,
        categoryName: categoryName,
      };
      promise = updateIssueCategory(updateData);
    } else {
      const createData = {
        categoryName: categoryName,
      };
      promise = createIssueCategory(createData);
    }

    toast.promise(promise, {
      loading: isEditMode ? 'Updating category...' : 'Creating category...',
      success: () => {
        setIsSubmitting(false);
        onSave(); // This refetches data on the main page
        return `Category ${isEditMode ? 'updated' : 'created'} successfully!`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'An error occurred.';
      },
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold text-stone-800">
            {isEditMode ? 'Edit Issue Category' : 'Create New Category'}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-stone-600">
            {isEditMode ? `Updating category #${category.categoryId}` : 'Define a new issue category.'}
          </Dialog.Description>

          <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Category Name */}
            <Form.Field name="categoryName">
              <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Category Name</Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Network Disruption"
                  required
                  className="block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </Form.Control>
            </Form.Field>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Dialog.Close asChild><Button variant="ghost">Cancel</Button></Dialog.Close>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </Form.Root>

          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-stone-500 hover:bg-stone-100">
            <X className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default IssueCategoryFormModal;