// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Import all the icons we'll need
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Users,
  BarChart,
  ShieldAlert,
  Wrench,
  UserCheck,
  MessageSquare, // New icon for Feedbacks
  UserCircle, // New icon for My Profile
  ClipboardList,
  BotMessageSquare,
  SlidersHorizontal,
  Wand2,
  CheckCircle,
  UserCog
} from 'lucide-react';

// --- Link Definitions By Role ---
// (We add the new links to the *end* of each role's array)

const customerLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'New Ticket', to: '/tickets/new', icon: PlusCircle },
  { name: 'My Tickets', to: '/my-tickets', icon: Ticket },
  { name: 'Feedbacks', to: '/feedbacks', icon: MessageSquare }, // Added
  { name: 'AI Agent', to: '/ai-agent', icon: BotMessageSquare },
  { name: 'My Profile', to: '/profile', icon: UserCircle }, // Added
];

const agentLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'All Tickets', to: '/tickets/all', icon: Ticket },
  { name: 'New Ticket', to: '/tickets/new', icon: PlusCircle },
  { name: 'Customers', to: '/customers', icon: Users },
  { name: 'Feedbacks', to: '/feedbacks', icon: MessageSquare }, // Added
  { name: 'AI Agent', to: '/ai-agent', icon: BotMessageSquare},
  { name: 'My Profile', to: '/profile', icon: UserCircle }, // Added
];

const supportAgentLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'All Tickets', to: '/tickets/all', icon: Ticket },
  { name: 'New Ticket', to: '/tickets/new', icon: PlusCircle },
  { name: 'AI Agent', to: '/ai-agent', icon: BotMessageSquare },
  { name: 'My Profile', to: '/profile', icon: UserCircle }, // Added
];

const managerLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: BarChart },
  { name: 'All Tickets', to: '/tickets/all', icon: Ticket },
  { name: 'Analytics', to: '/reports', icon: BarChart },
  { name: 'Manage Employee', to: '/admin/employees', icon: UserCog }, // <-- ADDED
  { name: 'SLA Management', to: '/admin/sla', icon: SlidersHorizontal },
  { name: 'Issue Category Management', to: '/admin/categories', icon: ClipboardList },
  { name: 'Change Roles', to: '/admin/roles', icon: Users },
  { name: 'AI Agent', to: '/ai-agent', icon: BotMessageSquare },
  { name: 'My Profile', to: '/profile', icon: UserCircle }, // Added
];


const triageOfficerLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Triage Tickets', to: '/tickets/triage', icon: ShieldAlert },
  { name: 'All Tickets', to: '/tickets/all', icon: Ticket },
  { name: 'AI Agent', to: '/ai-agent', icon: BotMessageSquare },
  { name: 'My Profile', to: '/profile', icon: UserCircle },
];

const engineerLinks = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Resolve Tickets', to: '/tickets/resolve', icon: CheckCircle },  
  { name: 'All Tickets', to: '/tickets/all', icon: Ticket },
  { name: 'AI Agent', to: '/ai-agent', icon: BotMessageSquare },
  { name: 'My Profile', to: '/profile', icon: UserCircle },
];

// Helper to choose the right link set
const getLinksByRole = (role) => {
  switch (role) {
    case 'ROLE_MANAGER':
      return managerLinks;

    case 'ROLE_SUPPORT_AGENT':
      return supportAgentLinks;

    case 'ROLE_TRIAGE_OFFICER':
      return triageOfficerLinks;

    case 'ROLE_CUSTOMER':
      return customerLinks;
    // ... other roles
    case 'ROLE_TECH_SUPPORT_ENGINEER':
    case 'ROLE_NOC_ENGINEER':
    case 'ROLE_FIELD_ENGINEER':
      return engineerLinks;

    default:
      return customerLinks;
  }
};

// Helper for NavLink active styling
const getNavLinkClass = ({ isActive }) =>
  `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
    isActive
      ? 'bg-amber-100 text-amber-600'
      : 'text-stone-700 hover:bg-stone-100'
  }`;

// --- The Sidebar Component ---
const Sidebar = () => {
  const { user } = useAuth();
  const navLinks = getLinksByRole(user?.role);

  return (
    <motion.div
      className="flex w-64 flex-col border-r border-stone-200 bg-stone-50 p-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <NavLink to={link.to} key={link.name} className={getNavLinkClass}>
            <link.icon className="mr-3 h-5 w-5" />
            {link.name}
          </NavLink>
        ))}
      </nav>
      
      {/* The separate 'Settings' link is gone, as 'My Profile' replaces it */}
    </motion.div>
  );
};

export default Sidebar;