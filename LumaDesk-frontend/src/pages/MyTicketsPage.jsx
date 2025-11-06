// src/pages/MyTicketsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTicketsByUserId, closeTicket } from '../api/ticketService';
import { getActionLogs, getAssignmentLogs } from '../api/logService';
import TicketStatusBadge from '../components/ui/TicketStatusBadge';
import {
  Loader2,
  AlertCircle,
  Eye,
  ArrowRight,
  ChevronDown,
  X,
  Clock,
  User,
  Type,
  Check,
  Ticket,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';

// --- Reusable Helper Components ---

// Reusable Select Item (for Radix)
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

// Helper for formatting dates
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// Component to render the main ticket details
const TicketInfoCard = ({ ticket }) => (
  <div className="overflow-hidden rounded-lg bg-white border border-stone-200">
    <div className="p-6">
      <h2 className="text-xl font-semibold text-stone-800">Ticket Details</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-stone-500">Status</p>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <div>
          <p className="text-sm font-medium text-stone-500">Category</p>
          <p className="text-stone-800">{ticket.issueCategory.categoryName}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-stone-500">Description</p>
          <p className="text-stone-800">{ticket.issueDescription}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="text-sm font-medium text-stone-500">Created At</p>
            <p className="text-sm text-stone-600">{formatDateTime(ticket.createdAt)}</p>
          </div>
          {/* This div was messed up before. Fixed now. */}
          <div> 
            <p className="text-sm font-medium text-stone-500">Last Updated</p>
            <p className="text-sm text-stone-600">{formatDateTime(ticket.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Component to render log tables
const LogTable = ({ title, logs, type }) => (
  <div className="mt-6 overflow-hidden rounded-lg bg-white border border-stone-200">
    <div className="p-6">
      <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
      {logs.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">No {title.toLowerCase()} found.</p>
      ) : (
        <ul className="mt-4 max-h-60 overflow-y-auto divide-y divide-stone-200">
          {logs.map(log => (
            <li key={log.actionId || log.assignmentId} className="flex gap-4 py-4">
              <div className="flex-shrink-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                  {type === 'action' ? <Type size={20} /> : <User size={20} />}
                </span>
              </div>
              <div className="flex-1">
                {type === 'action' ? (
                  <>
                    <p className="text-sm text-stone-700">
                      Status set to <TicketStatusBadge status={log.status} /> by User {log.updatedBy}
                    </p>
                    {log.actionNote && <p className="mt-1 text-sm text-stone-600 italic">"{log.actionNote}"</p>}
                  </>
                ) : (
                  <p className="text-sm text-stone-700">
                    Assigned to User {log.assignedTo} by User {log.assignedBy}
                  </p>
                )}
                <p className="mt-1 text-xs text-stone-500">
                  <Clock size={12} className="mr-1 inline" />
                  {formatDateTime(log.actionTime || log.assignedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

// --- Acceptance Box Component ---
const AcceptResolutionBox = ({ ticket, resolutionLog, onAcceptSuccess }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    const closeData = {
      ticketId: ticket.ticketId,
      customerId: user.userId,
    };
    const promise = closeTicket(closeData);
    toast.promise(promise, {
      loading: 'Closing ticket...',
      success: () => {
        onAcceptSuccess();
        return `Ticket #${ticket.ticketId} has been closed.`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message || 'Failed to close ticket.';
      },
    });
  };

  return (
    <div className="mt-6 rounded-lg border-2 border-lime-500 bg-lime-50 p-6">
      <h3 className="flex items-center text-lg font-semibold text-lime-800">
        <CheckCircle className="mr-2 h-5 w-5" />
        Resolution Note
      </h3>
      {resolutionLog ? (
        <blockquote className="mt-2 border-l-4 border-lime-300 pl-4 italic text-stone-700">
          "{resolutionLog.actionNote}"
        </blockquote>
      ) : (
        <p className="mt-2 text-sm text-stone-600">
          The support team has resolved this ticket.
        </p>
      )}
      <Button
        variant="primary"
        className="mt-4"
        onClick={handleAccept}
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Accept & Close Ticket
      </Button>
    </div>
  );
};

// --- UPDATED Modal Component ---
const TicketDetailsModal = ({ ticket, onClose, onAcceptSuccess }) => {
  const [actionLogs, setActionLogs] = useState([]);
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [error, setError] = useState(null);

  const resolutionLog = useMemo(() => {
    if (!actionLogs) return null;
    return [...actionLogs]
      .reverse()
      .find(log => log.status === 'RESOLVED');
  }, [actionLogs]);
  
  useEffect(() => {
    if (!ticket) return;
    const fetchLogs = async () => {
      try {
        setIsLoadingLogs(true);
        setError(null);
        const [actionRes, assignRes] = await Promise.all([
          getActionLogs(ticket.ticketId),
          getAssignmentLogs(ticket.ticketId)
        ]);
        setActionLogs(actionRes.data);
        setAssignmentLogs(assignRes.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        setError("Could not load ticket logs.");
      } finally {
        setIsLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [ticket]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-stone-100 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <Dialog.Title className="text-2xl font-bold text-stone-800">
            Ticket #{ticket.ticketId}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button onClick={onClose} className="rounded-full p-1 text-stone-500 hover:bg-stone-200">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </div>

        <div className="mt-4 grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
          <section>
            <TicketInfoCard ticket={ticket} />
            {ticket.status === 'RESOLVED' && (
              <AcceptResolutionBox
                ticket={ticket}
                resolutionLog={resolutionLog}
                onAcceptSuccess={onAcceptSuccess}
              />
            )}
          </section>
          <section>
            {isLoadingLogs ? (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-white shadow-sm">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : error ? (
              <div className="flex items-center rounded-lg bg-rose-50 p-4 text-rose-600">
                <AlertCircle className="mr-3 h-6 w-6" /> <p>{error}</p>
              </div>
            ) : (
              <>
                <LogTable title="Action Logs" logs={actionLogs} type="action" />
                <LogTable title="Assignment Logs" logs={assignmentLogs} type="assignment" />
              </>
            )}
          </section>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

// --- The Main Page Component ---
const allStatuses = [
  'ALL', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'REOPENED', 'ON_HOLD', 'RESOLVED', 'CLOSED'
];
const sortOptions = [
  { value: 'newest', label: 'Last Updated (Newest)' },
  { value: 'oldest', label: 'Last Updated (Oldest)' },
  { value: 'status', label: 'Status' },
];

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    if (!user?.userId) return;
    try {
      setIsLoading(true);
      const response = await getTicketsByUserId(user.userId);
      setTickets(response.data || []);
      setError(null);
    } catch (err){
      console.error('Failed to fetch tickets:', err);
      setError('Could not load your ticket data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTickets();
  }, [user]);

  // This is the line you mentioned. It's pure JavaScript, no TS.
  // The error must have been caused by a typo elsewhere.
  const processedTickets = useMemo(() => {
    let filtered = (statusFilter === 'ALL')
      ? tickets
      : tickets.filter(ticket => ticket.status === statusFilter);

    // Now sort
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;
      case 'status':
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    return filtered;
  }, [tickets, statusFilter, sortBy]);

  const handleModalCloseSuccess = () => {
    setSelectedTicket(null);
    fetchTickets();
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
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Dialog.Root
      open={!!selectedTicket}
      onOpenChange={(open) => !open && setSelectedTicket(null)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-stone-800">My Tickets</h1>
          
          <div className="flex gap-2">
            {/* Filter by Status */}
            <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
              <Select.Trigger className="flex h-10 items-center justify-between gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm">
                <Select.Value /> <Select.Icon><ChevronDown className="h-4 w-4" /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                  <Select.Viewport className="p-1">
                    {allStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            
            {/* Sort by */}
            <Select.Root value={sortBy} onValueChange={setSortBy}>
              <Select.Trigger className="flex h-10 items-center justify-between gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm">
                <Select.Value /> <Select.Icon><ChevronDown className="h-4 w-4" /></Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white shadow-lg">
                  <Select.Viewport className="p-1">
                    {sortOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <Ticket className="mx-auto h-12 w-12" />
              <p className="mt-4">You have not created any tickets yet.</p>
              <Link to="/tickets/new" className="mt-4 inline-flex items-center text-amber-600">
                Create one now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : processedTickets.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <p className="mt-4 font-medium">No tickets found</p>
              <p className="mt-1 text-sm">No tickets match the status "{statusFilter}".</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Last Updated</th>
                  <th className="relative px-6 py-3"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {processedTickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="transition-colors hover:bg-stone-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-amber-600">
                      #{ticket.ticketId}
                    </td>
                    <td className="max-w-xs truncate whitespace-nowrap px-6 py-4 text-sm text-stone-800">
                      {ticket.issueDescription}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-500">
                      {formatDateTime(ticket.updatedAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-800"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        View <Eye className="ml-2 h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onAcceptSuccess={handleModalCloseSuccess}
          />
        )}
      </motion.div>
    </Dialog.Root>
  );
};

export default MyTicketsPage;