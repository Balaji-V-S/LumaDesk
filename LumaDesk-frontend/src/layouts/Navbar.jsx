// src/components/layout/LandingNavbar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { Ticket } from 'lucide-react'; // Swapped for img
import { Button } from '../components/ui/Button';

const LandingNavbar = () => {
  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* 1. Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center">
            {/* Using your image path from the other file */}
            <img
              src="/assets/lumadesk-logo.png"
              alt="LumaDesk Logo"
              className="h-10 w-auto" // Adjusted height for a navbar
            />
          </Link>

          {/* 2. Actions */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild variant="primary">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;