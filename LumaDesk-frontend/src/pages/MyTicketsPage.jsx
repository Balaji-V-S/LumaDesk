// src/pages/MyTicketsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTicketsByUserId } from '../api/ticketService';
import { getActionLogs, getAssignmentLogs } from '../api/logService'; // Import the log service
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
  Ticket, // Added for empty state
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Select from '@radix-ui/react-select'; // For the filter
import * as Dialog from '@radix-ui/react-dialog'; // For the modal
import { Button } from '../components/ui/Button'; // For the modal button

// --- Reusable Helper Components (for the modal) ---

// Helper for formatting dates
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// Component to render the main ticket details in the modal
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
           <div>
            <p className="text-sm font-medium text-stone-500">Last Updated</p>
            <p className="text-sm text-stone-600">{formatDateTime(ticket.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Component to render one of the log tables in the modal
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

// --- The Modal Component ---
// This component fetches its own logs when it opens.
const TicketDetailsModal = ({ ticket, onClose }) => {
  const [actionLogs, setActionLogs] = useState([]);
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Don't fetch if there's no ticket
    if (!ticket) return;

    const fetchLogs = async () => {
      try {
        setIsLoadingLogs(true);
        setError(null);
        // Fire off both requests at the same time
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
  }, [ticket]); // Re-run this effect when the 'ticket' prop changes

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-stone-100 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <Dialog.Title className="text-2xl font-bold text-stone-800">
            Ticket #{ticket.ticketId}
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="rounded-full p-1 text-stone-500 hover:bg-stone-200">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </div>

        <div className="mt-4 grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
          {/* Left Column: Ticket Info */}
          <section>
            <TicketInfoCard ticket={ticket} />
          </section>

          {/* Right Column: Logs */}
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

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // --- NEW: State for the modal ---
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.userId) return;
      try {
        setIsLoading(true);
        const response = await getTicketsByUserId(user.userId);
        response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Could not load your ticket data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'ALL') return tickets;
    return tickets.filter(ticket => ticket.status === statusFilter);
  }, [tickets, statusFilter]);

  // --- Render Logic ---

  if (isLoading) { /* ... (Loading spinner) ... */ }
  if (error) { /* ... (Error message) ... */ }

  return (
    // We wrap the whole page in the Dialog.Root
    <Dialog.Root
      open={!!selectedTicket}
      onOpenChange={(open) => !open && setSelectedTicket(null)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <h1 className="mb-6 text-3xl font-bold text-stone-800">My Tickets</h1>
          
          {/* --- Radix Select for Status Filter (No Change) --- */}
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            {/* ... (All the Select logic is the same) ... */}
          </Select.Root>
        </div>

        {/* Ticket List Container */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <Ticket className="mx-auto h-12 w-12" />
              <p className="mt-4">You have not created any tickets yet.</p>
              <Link to="/tickets/new" className="mt-4 inline-flex items-center text-amber-600">
                Create one now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <p className="mt-4 font-medium">No tickets found</p>
              <p className="mt-1 text-sm">No tickets match the status "{statusFilter}".</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                {/* ... (table headers are the same) ... */}
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredTickets.map((ticket) => (
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
                      
                      {/* --- THIS IS THE CHANGE --- */}
                      {/* From <Link> to <Button> to open the modal */}
                      <Button
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-800"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        View <Eye className="ml-2 h-4 w-4" />
                      </Button>
                      {/* --- END CHANGE --- */}
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- The Modal itself, which renders when 'selectedTicket' is not null --- */}
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}

      </motion.div>
    </Dialog.Root>
  );
};

export default MyTicketsPage;