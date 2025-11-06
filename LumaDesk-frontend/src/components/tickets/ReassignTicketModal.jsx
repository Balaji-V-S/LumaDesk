// src/components/tickets/ReassignTicketModal.jsx
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { X, Loader2, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { reassignTicket } from '../../api/ticketService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const ReassignTicketModal = ({ ticket, onClose, onSaveSuccess }) => {
  const { user } = useAuth(); // This is the 'reassignedById'
  const [newAssignedToId, setNewAssignedToId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reassignData = {
      ticketId: ticket.ticketId,
      reassignedById: user.userId,
      newAssignedToId: parseInt(newAssignedToId, 10),
    };

    const promise = reassignTicket(reassignData);

    toast.promise(promise, {
      loading: 'Reassigning ticket...',
      success: () => {
        setIsSubmitting(false);
        onSaveSuccess(); // This will refetch the list
        return `Ticket #${ticket.ticketId} reassigned to Engineer #${newAssignedToId}.`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'Failed to reassign ticket.';
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
        <Dialog.Title className="text-xl font-semibold text-stone-800">
          Reassign Ticket #{ticket.ticketId}
        </Dialog.Title>
        <Dialog.Description className="mt-1 text-sm text-stone-600">
          Assign this ticket to another engineer or team.
        </Dialog.Description>

        <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Form.Field name="newAssignedToId">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              New Assignee User ID
            </Form.Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <UserPlus className="h-5 w-5 text-stone-400" />
              </span>
              <Form.Control asChild>
                <input
                  type="number"
                  value={newAssignedToId}
                  onChange={(e) => setNewAssignedToId(e.target.value)}
                  placeholder="Enter the new Engineer's User ID..."
                  required
                  className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </Form.Control>
            </div>
          </Form.Field>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Dialog.Close asChild><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button></Dialog.Close>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reassign
            </Button>
          </div>
        </Form.Root>

        <Dialog.Close onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-stone-500 hover:bg-stone-100">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default ReassignTicketModal;