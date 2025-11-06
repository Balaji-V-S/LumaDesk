// src/components/tickets/HoldTicketModal.jsx
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { X, Loader2, PauseCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { holdTicket } from '../../api/ticketService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const HoldTicketModal = ({ ticket, onClose, onSaveSuccess }) => {
  const { user } = useAuth();
  const [actionNote, setActionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const holdData = {
      ticketId: ticket.ticketId,
      engineerId: user.userId,
      actionNote: actionNote,
    };

    const promise = holdTicket(holdData);

    toast.promise(promise, {
      loading: 'Placing ticket on hold...',
      success: () => {
        setIsSubmitting(false);
        onSaveSuccess(); // This will refetch the list
        return `Ticket #${ticket.ticketId} is now ON_HOLD.`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'Failed to hold ticket.';
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
        <Dialog.Title className="text-xl font-semibold text-stone-800">
          Place Ticket #{ticket.ticketId} on Hold
        </Dialog.Title>
        <Dialog.Description className="mt-1 text-sm text-stone-600">
          Please provide a reason for placing this ticket on hold.
        </Dialog.Description>

        <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Action Note */}
          <Form.Field name="actionNote">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              Reason / Action Note <span className="text-rose-500">*</span>
            </Form.Label>
            <Form.Control asChild>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={4}
                required
                className="block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                placeholder="e.g., 'Waiting for customer response...'"
              />
            </Form.Control>
          </Form.Field>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Dialog.Close asChild><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button></Dialog.Close>
            <Button type="submit" variant="accent" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place on Hold
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

export default HoldTicketModal;