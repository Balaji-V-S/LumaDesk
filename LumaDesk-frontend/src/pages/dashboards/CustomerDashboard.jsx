// src/pages/dashboards/CustomerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTicketsByUserId } from '../../api/ticketService';
import StatCard from '../../components/ui/StatCard';
import {
  Loader2,
  AlertCircle,
  PlusCircle,
  UserCheck,
  Wrench,
  PauseCircle,
  AlertTriangle,
  CheckCircle,
  Archive,
  Zap, // New Icon
  Clock, // New Icon
} from 'lucide-react';

// Define the full list of statuses to initialize counts
const allStatuses = [
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'ON_HOLD',
  'REOPENED',
  'RESOLVED',
  'CLOSED',
];

// Helper to count tickets
const processTickets = (tickets) => {
  // Initialize counts for all statuses
  const initialCounts = {};
  allStatuses.forEach((status) => {
    initialCounts[status] = 0;
  });

  // Count the tickets
  return tickets.reduce((acc, ticket) => {
    if (acc[ticket.status] !== undefined) {
      acc[ticket.status]++;
    }
    return acc;
  }, initialCounts);
};

/**
 * NEW HELPER 1: Calculates Avg. Resolution Time in hours
 */
const calculateAvgResolutionTime = (tickets) => {
  if (!tickets || tickets.length === 0) {
    return 0;
  }

  const totalDurationMs = tickets.reduce((sum, ticket) => {
    const startTime = new Date(ticket.createdAt);
    const endTime = new Date(ticket.updatedAt);
    const durationMs = endTime.getTime() - startTime.getTime();
    return sum + durationMs;
  }, 0);

  const avgMs = totalDurationMs / tickets.length;
  const avgHours = avgMs / (1000 * 60 * 60); // Convert ms to hours
  return avgHours;
};

/**
 * NEW HELPER 2: Formats hours into a readable string (e.g., "1d 4h")
 */
const formatDuration = (hours) => {
  if (hours === 0) return 'N/A';

  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours * 60) % 60);

  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) parts.push(`${remainingHours}h`);
  if (days === 0 && remainingHours === 0 && minutes > 0) parts.push(`${minutes}m`); // Only show minutes if less than an hour
  if (parts.length === 0) return "N/A"; // Handle cases where tickets might be brand new

  return parts.join(' ');
};

/**
 * NEW HELPER 3: Gets dynamic color and icon based on time
 */
const getArtTileProps = (hours) => {
  // < 1 day (24 hours)
  if (hours < 24) {
    return { colorName: 'lime', icon: Zap }; // 'lime' is our green
  }
  // 1 to 3 days (24-72 hours)
  if (hours >= 24 && hours <= 72) {
    return { colorName: 'amber', icon: Clock }; // 'amber' is our yellow
  }
  // > 3 days (72 hours)
  return { colorName: 'rose', icon: AlertTriangle }; // 'rose' is our red
};

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  // --- NEW STATE ---
  const [avgTimeHours, setAvgTimeHours] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user || !user.userId) {
        setError('User not found. Cannot fetch tickets.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getTicketsByUserId(user.userId);

        // --- UPDATE: Calculate both stats from the same data ---
        const ticketData = response.data || [];
        const counts = processTickets(ticketData);
        const avgHours = calculateAvgResolutionTime(ticketData);

        setStats(counts);
        setAvgTimeHours(avgHours); // Set the new state
        setError(null);
        // --- END UPDATE ---

      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Could not load your ticket data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]); // Re-run if the user object changes

  // --- Render Logic ---

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

  // --- NEW: Calculate props for the new tile ---
  const artProps = getArtTileProps(avgTimeHours);
  const formattedArt = formatDuration(avgTimeHours);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-stone-800">
        Welcome back, {user?.fullName}!
      </h1>

      {/* --- NEW LAYOUT: 2-column grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT SIDE (Spans 2 columns) --- */}
        <div className="lg:col-span-2">
          {stats && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Active / Urgent Tickets (Rose) */}
              <StatCard
                title="New"
                count={stats.NEW}
                icon={PlusCircle}
                colorName="rose"
              />
              <StatCard
                title="Reopened"
                count={stats.REOPENED}
                icon={AlertTriangle}
                colorName="rose"
              />

              {/* In Progress Tickets (Amber) */}
              <StatCard
                title="Assigned"
                count={stats.ASSIGNED}
                icon={UserCheck}
                colorName="amber"
              />
              <StatCard
                title="In Progress"
                count={stats.IN_PROGRESS}
                icon={Wrench}
                colorName="amber"
              />

              {/* Completed Tickets (Lime) */}
              <StatCard
                title="Resolved"
                count={stats.RESOLVED}
                icon={CheckCircle}
                colorName="lime"
              />
              <StatCard
                title="Closed"
                count={stats.CLOSED}
                icon={Archive}
                colorName="lime"
              />

              {/* Other Statuses (Stone) */}
              <StatCard
                title="On Hold"
                count={stats.ON_HOLD}
                icon={PauseCircle}
                colorName="stone"
              />
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE (Spans 1 column) --- */}
        <div className="lg:col-span-1">
          {avgTimeHours !== null && (
            <StatCard
              title="Avg. Resolution Time"
              count={formattedArt}
              icon={artProps.icon}
              colorName={artProps.colorName}
            />
          )}
        </div>
        
      </div>
    </div>
  );
};