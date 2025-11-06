// src/pages/ResolveTicketsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTicketsByAssignedTo, openTicket } from '../api/ticketService';
import TicketStatusBadge from '../components/ui/TicketStatusBadge';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Ticket,
  Check,
  Eye,
  PauseCircle,
  Wrench,
  UserPlus, // <-- New Icon
} from 'lucide-react';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../components/ui/Button';
import { toast } from 'sonner';

// Import all 4 modals
import ResolveTicketModal from '../components/tickets/ResolveTicketModal';
import HoldTicketModal from '../components/tickets/HoldTicketModal';
import TicketDetailsModal from '../components/tickets/TicketDetailsModal';
import ReassignTicketModal from '../components/tickets/ReassignTicketModal'; // <-- New Import

// Helper to format date
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const ResolveTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- STATE FOR 4 MODALS ---
  const [viewTicket, setViewTicket] = useState(null);
  const [holdTicket, setHoldTicket] = useState(null);
  const [resolveTicket, setResolveTicket] = useState(null);
  const [reassignTicket, setReassignTicket] = useState(null); // <-- New State

  const fetchData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await getTicketsByAssignedTo(user.userId);
      response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTickets(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Could not load your assigned tickets.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.userId) {
      fetchData();
    }
  }, [user]);

  const workQueue = useMemo(() => {
    return tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  }, [tickets]);

  const handleViewClick = async (ticket) => {
    setViewTicket(ticket);
    if (ticket.status === 'ASSIGNED' || ticket.status === 'ON_HOLD' || ticket.status === 'REOPENED') {
      try {
        await openTicket({
          ticketId: ticket.ticketId,
          engineerId: user.userId,
        });
        fetchData();
      } catch (err) {
        console.error("Failed to mark ticket as IN_PROGRESS", err);
      }
    }
  };

  // --- HANDLERS for modal success ---
  const handleSaveSuccess = () => {
    setResolveTicket(null);
    setHoldTicket(null);
    setReassignTicket(null); // <-- Add to handler
    fetchData(); // Refresh the list
  };

  if (isLoading) { /* ... (loading spinner) ... */ }
  if (error) { /* ... (error message) ... */ }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-stone-800">My Work Queue</h1>
          <div className="flex items-center gap-2 text-amber-500">
            <Wrench className="h-6 w-6" />
            <span className="text-xl font-bold">{workQueue.length}</span>
            <span className="text-lg">Open Tickets</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 bg-white">
              {workQueue.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td className="px-6 py-4 text-sm font-medium text-amber-600">#{ticket.ticketId}</td>
                  <td className="px-6 py-4 text-sm text-stone-500 max-w-sm truncate">{ticket.issueDescription}</td>
                  <td className="px-6 py-4 text-sm"><TicketStatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 text-sm text-stone-500">{ticket.createdFor}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{formatDateTime(ticket.updatedAt)}</td>
                  
                  {/* --- UPDATED BUTTONS --- */}
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-amber-600 hover:text-amber-700" 
                      onClick={() => handleViewClick(ticket)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-700" 
                      onClick={() => setHoldTicket(ticket)}
                    >
                      <PauseCircle className="mr-1 h-4 w-4" /> Hold
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-lime-600 hover:text-lime-700" 
                      onClick={() => setResolveTicket(ticket)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" /> Resolve
                    </Button>
                    {/* --- NEW BUTTON --- */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-stone-600 hover:text-stone-700"
                      onClick={() => setReassignTicket(ticket)}
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> Reassign
                    </Button>
                  </td>
                  {/* --- END FIX --- */}
                  
                </tr>
              ))}
            </tbody>
          </table>
          {workQueue.length === 0 && (
            <div className="p-12 text-center text-stone-500">
              <Check className="mx-auto h-12 w-12 text-lime-500" />
              <p className="mt-4 font-medium">Work Queue Clear</p>
              <p className="mt-1 text-sm">You have no open tickets assigned to you. Great job!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- THE 4 MODALS (Un-nested) --- */}
      <Dialog.Root open={!!viewTicket} onOpenChange={(open) => !open && setViewTicket(null)}>
        {viewTicket && (
          <TicketDetailsModal ticket={viewTicket} onClose={() => setViewTicket(null)} />
        )}
      </Dialog.Root>

      <Dialog.Root open={!!holdTicket} onOpenChange={(open) => !open && setHoldTicket(null)}>
        {holdTicket && (
          <HoldTicketModal
            ticket={holdTicket}
            onClose={() => setHoldTicket(null)}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </Dialog.Root>

      <Dialog.Root open={!!resolveTicket} onOpenChange={(open) => !open && setResolveTicket(null)}>
        {resolveTicket && (
          <ResolveTicketModal
            ticket={resolveTicket}
            onClose={() => setResolveTicket(null)}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </Dialog.Root>

      {/* --- NEW MODAL ROOT --- */}
      <Dialog.Root open={!!reassignTicket} onOpenChange={(open) => !open && setReassignTicket(null)}>
        {reassignTicket && (
          <ReassignTicketModal
            ticket={reassignTicket}
            onClose={() => setReassignTicket(null)}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </Dialog.Root>
    </>
  );
};

export default ResolveTicketsPage;