// src/components/admin/SlaFormModal.jsx
import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { X, Loader2, Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { createSla, updateSla } from '../../api/slaService';
import { toast } from 'sonner';
import * as Select from '@radix-ui/react-select';

// Your enum options
const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const priorities = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

// Reusable Select Trigger
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

const SlaFormModal = ({ isOpen, onClose, onSave, sla }) => {
  const isEditMode = !!sla;
  
  // Form state
  const [severity, setSeverity] = useState('');
  const [priority, setPriority] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When the 'sla' prop changes (i.e., when opening the modal for edit),
  // populate the form fields.
  useEffect(() => {
    if (isEditMode) {
      setSeverity(sla.severity);
      setPriority(sla.priority);
      setTimeLimit(sla.timeLimitHour.toString());
    } else {
      // Reset form for "Create" mode
      setSeverity('');
      setPriority('');
      setTimeLimit('');
    }
  }, [sla, isOpen]); // Rerun when modal opens or 'sla' changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const slaData = {
      severity,
      priority,
      timeLimitHour: parseInt(timeLimit, 10),
    };

    let promise;

    if (isEditMode) {
      // Add the ID for updates
      promise = updateSla({ ...slaData, slaId: sla.slaId });
    } else {
      promise = createSla(slaData);
    }

    toast.promise(promise, {
      loading: isEditMode ? 'Updating SLA...' : 'Creating SLA...',
      success: () => {
        setIsSubmitting(false);
        onSave(); // This refetches data on the main page
        return `SLA ${isEditMode ? 'updated' : 'created'} successfully!`;
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
            {isEditMode ? 'Edit SLA' : 'Create New SLA'}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-stone-600">
            {isEditMode ? `Updating SLA #${sla.slaId}` : 'Define a new Service Level Agreement.'}
          </Dialog.Description>

          <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Severity */}
            <Form.Field name="severity">
              <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Severity</Form.Label>
              <Select.Root value={severity} onValueChange={setSeverity} required>
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 px-3 text-sm"><Select.Value placeholder="Select severity..." /><ChevronDown /></Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                    <Select.Viewport className="p-1">{severities.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Field>

            {/* Priority */}
            <Form.Field name="priority">
              <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Priority</Form.Label>
              <Select.Root value={priority} onValueChange={setPriority} required>
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 px-3 text-sm"><Select.Value placeholder="Select priority..." /><ChevronDown /></Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                    <Select.Viewport className="p-1">{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Field>

            {/* Time Limit */}
            <Form.Field name="timeLimit">
              <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Time Limit (in hours)</Form.Label>
              <Form.Control asChild>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder="e.g., 24"
                  required
                  className="block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </Form.Control>
            </Form.Field>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Dialog.Close asChild><Button variant="ghost">Cancel</Button></Dialog.Close>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Save Changes' : 'Create SLA'}
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

export default SlaFormModal;