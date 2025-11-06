// src/components/tickets/TicketDetailsModal.jsx
import React, { useEffect, useState } from 'react';
import { getActionLogs, getAssignmentLogs } from '../../api/logService';
import TicketStatusBadge from '../ui/TicketStatusBadge';
import { Loader2, AlertCircle, Clock, User, Type, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

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
          <p className="text-sm font-medium text-stone-500">Created For (Customer)</p>
          <p className="text-stone-800 font-medium">User #{ticket.createdFor}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-500">Created By</p>
          <p className="text-stone-800 font-medium">User #{ticket.createdBy}</p>
        </div>
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
          <div><p className="text-sm text-stone-500">Created At</p><p>{formatDateTime(ticket.createdAt)}</p></div>
          <div><p className="text-sm text-stone-500">Last Updated</p><p>{formatDateTime(ticket.updatedAt)}</p></div>
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
              <div className="flex-shrink-0"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600">{type === 'action' ? <Type size={20} /> : <User size={20} />}</span></div>
              <div className="flex-1">
                {type === 'action' ? (
                  <>
                    <p className="text-sm text-stone-700">Status set to <TicketStatusBadge status={log.status} /> by User {log.updatedBy}</p>
                    {log.actionNote && <p className="mt-1 text-sm text-stone-600 italic">"{log.actionNote}"</p>}
                  </>
                ) : (
                  <p className="text-sm text-stone-700">Assigned to User {log.assignedTo} by User {log.assignedBy}</p>
                )}
                <p className="mt-1 text-xs text-stone-500"><Clock size={12} className="mr-1 inline" />{formatDateTime(log.actionTime || log.assignedAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

// --- The Modal Component ---
const TicketDetailsModal = ({ ticket, onClose }) => {
  const [actionLogs, setActionLogs] = useState([]);
  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [error, setError] = useState(null);
  
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
        <div className="flex items-center justify-between"><Dialog.Title className="text-2xl font-bold text-stone-800">Ticket #{ticket.ticketId}</Dialog.Title><Dialog.Close asChild><button onClick={onClose} className="rounded-full p-1 text-stone-500 hover:bg-stone-200"><X className="h-5 w-5" /></button></Dialog.Close></div>
        <div className="mt-4 grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-2">
          <section><TicketInfoCard ticket={ticket} /></section>
          <section>
            {isLoadingLogs ? (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-white shadow-sm"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
            ) : error ? (
              <div className="flex items-center rounded-lg bg-rose-50 p-4 text-rose-600"><AlertCircle className="mr-3 h-6 w-6" /> <p>{error}</p></div>
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

export default TicketDetailsModal;