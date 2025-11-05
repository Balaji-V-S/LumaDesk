// src/context/TicketContext.jsx
import * as React from 'react';

// This context will store the array of tickets fetched by MyTicketsPage
export const TicketContext = React.createContext({
  tickets: [], // The array of all tickets
  getTicketById: (id) => undefined, // A helper function to find one
});

// Helper hook
export const useTickets = () => {
  const context = React.useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};