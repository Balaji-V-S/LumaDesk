// src/api/ticketService.js
import axios from 'axios';

// Create a dedicated API client for the ticket service
const ticketApi = axios.create({
  baseURL: 'http://localhost:8080/api/tickets',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the JWT to every request
ticketApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Use the 'token' key we agreed on
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Gets all tickets for a specific user.
 * Matches: GET /api/tickets/get/{userId}
 * @param {number} userId The ID of the logged-in user
 */
export const getTicketsByUserId = (userId) => {
  return ticketApi.get(`/get/${userId}`);
};

/**
 * Creates a new ticket as a customer.
 * Matches: POST /api/tickets/raise-tickets/customer
 * @param {object} ticketData - { customerUserId, issueCategory, issueDescription }
 */
export const createCustomerTicket = (ticketData) => {
  return ticketApi.post('/raise-tickets/customer', ticketData);
};

/**
 * NEW: Creates a new ticket as an agent for a customer.
 * Matches: POST /api/tickets/raise-tickets/agent
 * @param {object} ticketData - { agentUserId, customerUserId, issueCategory, issueDescription }
 */
export const createAgentTicket = (ticketData) => {
  return ticketApi.post('/raise-tickets/agent', ticketData);
};

/**
 * NEW: Gets all tickets in the system (for agents/managers).
 * Matches: GET /api/tickets/all
 */
export const getAllTickets = () => {
  return ticketApi.get('/all');
};

/**
 * --- NEW ---
 * Triage a new ticket and assign it.
 * Matches: POST /api/tickets/triage-assign
 * @param {object} triageData - The full triage DTO
 */
export const triageAndAssignTicket = (triageData) => {
  return ticketApi.put('/triage-assign', triageData);
};

export default ticketApi;