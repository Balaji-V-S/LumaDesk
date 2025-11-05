// src/components/layout/AppNavbar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const AppNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      className="sticky top-0 z-30 w-full border-b border-stone-200 bg-stone-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 1. Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex flex-shrink-0 items-center">
            <img
              src="/assets/lumadesk-logo.png"
              alt="LumaDesk Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* 2. Actions and User Menu */}
        <div className="flex items-center space-x-4">

          {/* --- THIS IS THE NEW LINE --- */}
          <span className="hidden text-sm font-medium text-stone-700 sm:block">
            Hello, {user?.fullName}!
          </span>
          {/* --- END NEW LINE --- */}

          <button
            type="button"
            className="rounded-full p-1 text-stone-600 hover:bg-stone-100 hover:text-stone-800"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* User Dropdown Menu (Radix UI) */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <motion.button
                className="flex rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open user menu</span>
                <UserCircle className="h-8 w-8 text-stone-700" />
              </motion.button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="mt-2 w-56 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Label className="px-2 py-1.5 text-sm text-stone-500">
                  Signed in as
                  <br />
                  <span className="font-medium text-stone-800">
                    {user?.fullName || user?.email}
                  </span>
                </DropdownMenu.Label>
                <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold uppercase text-rose-500">
                  {user?.role}
                </DropdownMenu.Label>
                <DropdownMenu.Separator className="m-1 h-px bg-stone-200" />
                <DropdownMenu.Item asChild>
                  <Link
                    to="/profile"
                    className="group flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm text-stone-700 outline-none hover:bg-stone-100"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="m-1 h-px bg-stone-200" />
                <DropdownMenu.Item
                  className="group flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm text-rose-500 outline-none hover:bg-rose-50"
                  onSelect={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </motion.nav>
  );
};

export default AppNavbar;