// src/pages/CustomerDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
  File as LuFile,                // For Open
  Loader as LuLoader,            // For In Progress
  PauseCircle as LuPauseCircle,  // For On Hold
  CheckCircle as LuCheckCircle,  // For Closed
  Inbox as LuInbox,              // For Empty State
  Loader2 as LuLoader2,          // For Loading Spinner
  AlertTriangle as LuAlertTriangle, // For Error
  ChevronRight as LuChevronRight // For List Item
} from 'lucide-react';

const STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  CLOSED: 'CLOSED',
};

// Main Dashboard Component
export default function CustomerDashboard() {
  const { user } = useAuth();
  
  // State for data
  const [allTickets, setAllTickets] = useState([]);
  
  // State for UI
  const [selectedStatus, setSelectedStatus] = useState(STATUSES.OPEN);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    // Only fetch if the user object is available
    if (!user?.userId) {
      return; // Don't fetch if user is not yet loaded
    }

    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // This endpoint is assumed. Update it to your actual API endpoint.
        const response = await axiosInstance.get(`/tickets/user/${user.userId}`);
        setAllTickets(response.data || []);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
        setError("Could not load your tickets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]); // Re-run this effect if the user object changes

  // --- DATA DERIVATION ---
  // Memoize ticket counts to prevent recalculation on every render
  const ticketStats = useMemo(() => {
    // Initialize counts
    const counts = {
      [STATUSES.OPEN]: 0,
      [STATUSES.IN_PROGRESS]: 0,
      [STATUSES.ON_HOLD]: 0,
      [STATUSES.CLOSED]: 0,
    };
    // Tally counts from the master list
    for (const ticket of allTickets) {
      if (counts.hasOwnProperty(ticket.status)) {
        counts[ticket.status]++;
      }
    }
    return counts;
  }, [allTickets]); // Only recalculates when 'allTickets' changes

  // Memoize the filtered list to show the user
  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => ticket.status === selectedStatus);
  }, [allTickets, selectedStatus]); // Recalculates when master list or filter changes

  // --- UI STATES ---
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // --- RENDER ---
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.fullName || 'Customer'}!
        </h1>
        <p className="mt-1 text-slate-600">
          Here's a summary of your support tickets.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Open"
          count={ticketStats.OPEN}
          icon={<LuFile className="h-6 w-6" />}
          color="text-blue-600"
          isActive={selectedStatus === STATUSES.OPEN}
          onClick={() => setSelectedStatus(STATUSES.OPEN)}
        />
        <DashboardStatCard
          title="In Progress"
          count={ticketStats.IN_PROGRESS}
          icon={<LuLoader className="h-6 w-6" />}
          color="text-amber-600"
          isActive={selectedStatus === STATUSES.IN_PROGRESS}
          onClick={() => setSelectedStatus(STATUSES.IN_PROGRESS)}
        />
        <DashboardStatCard
          title="On Hold"
          count={ticketStats.ON_HOLD}
          icon={<LuPauseCircle className="h-6 w-6" />}
          color="text-slate-500"
          isActive={selectedStatus === STATUSES.ON_HOLD}
          onClick={() => setSelectedStatus(STATUSES.ON_HOLD)}
        />
        <DashboardStatCard
          title="Closed"
          count={ticketStats.CLOSED}
          icon={<LuCheckCircle className="h-6 w-6" />}
          color="text-green-600"
          isActive={selectedStatus === STATUSES.CLOSED}
          onClick={() => setSelectedStatus(STATUSES.CLOSED)}
        />
      </div>

      {/* Ticket List Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {selectedStatus.replace('_', ' ')} Tickets
        </h2>
        
        <TicketList tickets={filteredTickets} />
      </div>
    </div>
  );
}

// --- Reusable Sub-Component: Stat Card ---
function DashboardStatCard({ title, count, icon, color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col rounded-xl bg-white p-6 shadow-md transition-all duration-150
        hover:shadow-lg hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${isActive ? 'ring-2 ring-indigo-500 shadow-lg' : 'ring-1 ring-transparent'}
      `}
    >
      <div className={`flex items-center justify-between ${color}`}>
        <span className="text-lg font-medium">{title}</span>
        {icon}
      </div>
      <p className="mt-2 text-left text-4xl font-bold text-slate-800">
        {count}
      </p>
    </button>
  );
}

// --- Reusable Sub-Component: Ticket List ---
function TicketList({ tickets }) {
  // Empty State
  if (tickets.length === 0) {
    return <EmptyState />;
  }

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // List View
  return (
    <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-md">
      <ul className="divide-y divide-slate-200">
        {tickets.map((ticket) => (
          <li 
            key={ticket.id}
            className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50"
            onClick={() => { /* TODO: Navigate to ticket details page */ }}
          >
            <div className="flex-1">
              <p className="truncate text-base font-medium text-indigo-700">
                {ticket.subject || 'No Subject'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                #{ticket.id} &bull; Last updated {formatDate(ticket.updatedAt)}
              </p>
            </div>
            <LuChevronRight className="h-5 w-5 text-slate-400" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- UI State Components ---
function LoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <LuLoader2 className="h-12 w-12 animate-spin text-indigo-600" />
    </div>
  );
}

function ErrorDisplay({ message }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-300 bg-red-50 p-8">
      <LuAlertTriangle className="h-12 w-12 text-red-500" />
      <h3 className="mt-4 text-lg font-semibold text-red-800">
        Something went wrong
      </h3>
      <p className="mt-1 text-red-700">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-12">
      <LuInbox className="h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-700">
        No tickets found
      </h3>
      <p className="mt-1 text-slate-500">
        You have no tickets in this category.
      </p>
    </div>
  );
}