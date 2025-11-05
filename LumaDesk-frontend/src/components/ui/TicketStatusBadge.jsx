// src/components/ui/TicketStatusBadge.jsx
import React from 'react';

// Define colors for each status
const statusColors = {
  NEW: 'bg-rose-100 text-rose-700',
  ASSIGNED: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  ON_HOLD: 'bg-stone-100 text-stone-600',
  REOPENED: 'bg-rose-600 text-white',
  RESOLVED: 'bg-lime-100 text-lime-700',
  CLOSED: 'bg-green-100 text-green-700',
  default: 'bg-stone-100 text-stone-600',
};

const TicketStatusBadge = ({ status }) => {
  const colors = statusColors[status] || statusColors.default;
  const formattedStatus = (status || 'UNKNOWN').replace('_', ' ');

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${colors}`}
    >
      {formattedStatus}
    </span>
  );
};

export default TicketStatusBadge;