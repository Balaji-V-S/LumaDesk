// src/pages/TriageTicketsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllTickets, triageAndAssignTicket } from '../api/ticketService';
import { getAllSlas } from '../api/slaService';
import {
  Loader2,
  AlertCircle,
  ShieldAlert,
  Check,
  ChevronDown,
  X,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import TicketStatusBadge from '../components/ui/TicketStatusBadge';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// --- Reusable Select Item (for Radix) ---
const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => (
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
));

// --- Triage Form Modal ---
const TriageFormModal = ({ ticket, slas, onClose, onSaveSuccess }) => {
  const { user } = useAuth();
  
  const [selectedSlaId, setSelectedSlaId] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [priority, setPriority] = useState('');
  const [severity, setSeverity] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const priorities = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedSla = slas.find(s => s.slaId.toString() === selectedSlaId);
    if (!selectedSla) {
      toast.error("Invalid SLA selected.");
      setIsSubmitting(false);
      return;
    }

    const triageData = {
      ticketId: ticket.ticketId,
      sla: selectedSla,
      priority: priority,
      severity: severity,
      assignedTo: parseInt(assignedToId, 10),
      assignedBy: user.userId,
    };

    const promise = triageAndAssignTicket(triageData);

    toast.promise(promise, {
      loading: 'Triaging ticket...',
      success: () => {
        setIsSubmitting(false);
        onSaveSuccess();
        return `Ticket #${ticket.ticketId} triaged and assigned.`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'Triage failed.';
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
        <Dialog.Title className="text-xl font-semibold text-stone-800">
          Triage Ticket #{ticket.ticketId}
        </Dialog.Title>
        <Dialog.Description className="mt-1 text-sm text-stone-600">
          {ticket.issueDescription}
        </Dialog.Description>

        <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* SLA Dropdown */}
          <Form.Field name="sla">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Assign SLA</Form.Label>
            <Select.Root value={selectedSlaId} onValueChange={setSelectedSlaId} required>
              <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 px-3 text-sm">
                <Select.Value placeholder="Select an SLA..." />
                <ChevronDown />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                  <Select.Viewport className="p-1">
                    {slas.map(s => (
                      <SelectItem key={s.slaId} value={s.slaId.toString()}>
                        {`(${s.severity}/${s.priority}) - ${s.timeLimitHour}h`}
                      </SelectItem>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </Form.Field>

          {/* Severity and Priority */}
          <div className="flex gap-4">
            {/* Severity */}
            <Form.Field name="severity" className="flex-1">
              <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Severity</Form.Label>
              <Select.Root value={severity} onValueChange={setSeverity} required>
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 px-3 text-sm">
                  <Select.Value placeholder="Select severity..." />
                  <ChevronDown />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                    <Select.Viewport className="p-1">{severities.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Field>

            {/* Priority */}
            <Form.Field name="priority" className="flex-1">
              <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Priority</Form.Label>
              <Select.Root value={priority} onValueChange={setPriority} required>
                <Select.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-stone-300 px-3 text-sm">
                  <Select.Value placeholder="Select priority..." />
                  <ChevronDown />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                    <Select.Viewport className="p-1">{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Field>
          </div>

          {/* Assign To (Temporary number input) */}
          <Form.Field name="assignedTo">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">Assign To (User ID)</Form.Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <User className="h-5 w-5 text-stone-400" />
              </span>
              <Form.Control asChild>
                <input
                  type="number"
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  placeholder="Enter Agent/Engineer User ID..."
                  required
                  className="block w-full rounded-md border-stone-300 py-2 pl-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
              </Form.Control>
            </div>
          </Form.Field>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Dialog.Close asChild><Button variant="ghost">Cancel</Button></Dialog.Close>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Triage & Assign
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


// --- Main Triage Page ---
const TriageTicketsPage = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [allSlas, setAllSlas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all data on load
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ticketRes, slaRes] = await Promise.all([
        getAllTickets(),
        getAllSlas()
      ]);
      setAllTickets(ticketRes.data || []);
      setAllSlas(slaRes.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter for NEW tickets
  const newTickets = useMemo(() => {
    return allTickets.filter(t => t.status === 'NEW');
  }, [allTickets]);

  const handleTriageClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchData(); // Refetch all data to update the list
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center rounded-lg bg-rose-50 p-4 text-rose-600">
        <AlertCircle className="mr-3 h-6 w-6" />
        <div>
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-stone-800">Triage Queue</h1>
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert className="h-6 w-6" />
            <span className="text-xl font-bold">{newTickets.length}</span>
            <span className="text-lg">New Tickets</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Customer ID</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {newTickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td className="px-6 py-4 text-sm font-medium text-amber-600">#{ticket.ticketId}</td>
                  <td className="px-6 py-4 text-sm text-stone-500 max-w-sm truncate">{ticket.issueDescription}</td>
                  <td className="px-6 py-4 text-sm"><TicketStatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 text-sm text-stone-500">{ticket.createdFor}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {/* --- THIS IS THE FIX --- */}
                    <Button variant="primary" size="sm" onClick={() => handleTriageClick(ticket)}>
                      Triage
                    </Button>
                    {/* --- END FIX --- */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {newTickets.length === 0 && (
            <div className="p-12 text-center text-stone-500">
              <Check className="mx-auto h-12 w-12 text-lime-500" />
              <p className="mt-4 font-medium">Triage Queue Clear</p>
              <p className="mt-1 text-sm">There are no new tickets to triage.</p>
            </div>
          )}
        </div>

        {selectedTicket && (
          <TriageFormModal
            ticket={selectedTicket}
            slas={allSlas}
            onClose={handleCloseModal}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </motion.div>
    </Dialog.Root>
  );
};

export default TriageTicketsPage;