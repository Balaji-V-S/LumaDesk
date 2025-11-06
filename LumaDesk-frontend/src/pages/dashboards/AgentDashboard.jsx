// src/pages/dashboards/AgentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getAllTickets } from '../../api/ticketService';
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
  ShieldAlert, // New Icon
  Clock, // New Icon
  Zap, // New Icon
} from 'lucide-react';

// Define the full list of statuses to initialize counts
const allStatuses = [
  'NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'REOPENED', 'RESOLVED', 'CLOSED'
];

// Helper to count tickets by status
const processTickets = (tickets) => {
  const initialCounts = {};
  allStatuses.forEach(status => {
    initialCounts[status] = 0;
  });
  return tickets.reduce((acc, ticket) => {
    if (acc[ticket.status] !== undefined) {
      acc[ticket.status]++;
    }
    return acc;
  }, initialCounts);
};

/**
 * Calculates Avg. Resolution Time in hours for *closed* tickets
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
 * Formats hours into a readable string (e.g., "1d 4h")
 */
const formatDuration = (hours) => {
  if (hours === 0) return "N/A";
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours * 60) % 60);

  let parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) parts.push(`${remainingHours}h`);
  if (days === 0 && remainingHours === 0 && minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0) return "N/A";

  return parts.join(' ');
};

/**
 * Gets dynamic color and icon based on time
 */
const getArtTileProps = (hours) => {
  if (hours > 0 && hours < 24) return { colorName: 'lime', icon: Zap }; // < 1 day
  if (hours >= 24 && hours <= 72) return { colorName: 'amber', icon: Clock }; // 1-3 days
  if (hours > 72) return { colorName: 'rose', icon: AlertTriangle }; // > 3 days
  return { colorName: 'stone', icon: Clock }; // Default
};


export const AgentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [slaBreachedCount, setSlaBreachedCount] = useState(0);
  const [avgTimeHours, setAvgTimeHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setIsLoading(true);
        const response = await getAllTickets();
        const ticketData = response.data || [];

        // Run all calculations from the single data source
        const counts = processTickets(ticketData);
        const slaCount = ticketData.filter(t => t.slaBreached === true).length;
        const avgHours = calculateAvgResolutionTime(ticketData);

        setStats(counts);
        setSlaBreachedCount(slaCount);
        setAvgTimeHours(avgHours);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch all tickets:', err);
        setError('Could not load system ticket data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllTickets();
  }, []);

  // --- Render Logic ---
  if (isLoading) { /* ... (loading spinner) ... */ }
  if (error) { /* ... (error message) ... */ }

  const artProps = getArtTileProps(avgTimeHours);
  const formattedArt = formatDuration(avgTimeHours);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-stone-800">
        Agent Dashboard
      </h1>
      
      {/* --- BENTO BOX LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Main Box: Status Tiles (spans 2 columns) --- */}
        <div className="lg:col-span-2">
          {stats && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="New" count={stats.NEW} icon={PlusCircle} colorName="rose" />
              <StatCard title="Reopened" count={stats.REOPENED} icon={AlertTriangle} colorName="rose" />
              <StatCard title="Assigned" count={stats.ASSIGNED} icon={UserCheck} colorName="amber" />
              <StatCard title="In Progress" count={stats.IN_PROGRESS} icon={Wrench} colorName="amber" />
              <StatCard title="Resolved" count={stats.RESOLVED} icon={CheckCircle} colorName="lime" />
              <StatCard title="Closed" count={stats.CLOSED} icon={Archive} colorName="lime" />
              <StatCard title="On Hold" count={stats.ON_HOLD} icon={PauseCircle} colorName="stone" />
            </div>
          )}
        </div>

        {/* --- Side Box: Summary Stats (spans 1 column) --- */}
        <div className="lg:col-span-1 space-y-4">
          <StatCard
            title="SLA Breached"
            count={slaBreachedCount}
            icon={ShieldAlert}
            colorName={slaBreachedCount > 0 ? 'rose' : 'lime'}
          />
          <StatCard
            title="Avg. Resolution Time"
            count={formattedArt}
            icon={artProps.icon}
            colorName={artProps.colorName}
          />
        </div>
      </div>
    </div>
  );
};