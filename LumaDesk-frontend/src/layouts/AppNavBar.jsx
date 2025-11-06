// src/components/layout/AppNavbar.jsx
import React, { useState } from 'react'; // Import useState
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotificationsByUserId } from '../api/notificationService'; // Import new service
import {
  Bell,
  UserCircle,
  LogOut,
  Loader2, // Import new icons
  Inbox,
  AlertCircle,
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// Helper to format time (e.g., "5m ago", "2h ago")
const formatTimeAgo = (isoString) => {
  const date = new Date(isoString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'min ago';
  return Math.floor(seconds) + 's ago';
};

// Internal component for a single notification item
const NotificationItem = ({ notification }) => (
  <DropdownMenu.Item asChild>
    <a
      href="#" // You can change this later
      className="flex cursor-pointer gap-3 p-3 outline-none transition-colors hover:bg-stone-50"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-800">
          {notification.subject}
        </p>
        <p className="text-sm text-stone-600">{notification.message}</p>
        <p className="mt-1 text-xs text-stone-500">
          {formatTimeAgo(notification.creationTimestamp)}
        </p>
      </div>
    </a>
  </DropdownMenu.Item>
);

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This function is called when the dropdown is opened
  const fetchNotifications = async () => {
    if (!user?.userId) return; // No user, no notifications

    setIsLoading(true);
    setError(null);
    try {
      // Pass the userId as a string, per your requirement
      const response = await getNotificationsByUserId(String(user.userId));
      
      // Sort by most recent
      response.data.sort(
        (a, b) =>
          new Date(b.creationTimestamp) - new Date(a.creationTimestamp),
      );
      setNotifications(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  // This handler fetches data *only* when the menu is opened
  const handleOpenChange = (open) => {
    if (open) {
      fetchNotifications();
    }
  };

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
          <span className="hidden text-sm font-medium text-stone-700 sm:block">
            Hello, {user?.fullName}!
          </span>

          {/* --- NOTIFICATION DROPDOWN --- */}
          <DropdownMenu.Root onOpenChange={handleOpenChange}>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="relative rounded-full p-1 text-stone-600 hover:bg-stone-100 hover:text-stone-800"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {/* We could add a notification dot here if we had a count API */}
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={5}
                className="mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 md:w-96"
              >
                <div className="flex items-center justify-between border-b border-stone-200 p-3">
                  <h3 className="font-semibold text-stone-800">
                    Notifications
                  </h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-10">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 p-3 text-sm text-rose-500">
                      <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-stone-500">
                      <Inbox size={32} />
                      <p className="mt-2 text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {notifications.map((notif) => (
                        <NotificationItem
                          key={notif.notificationId}
                          notification={notif}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-stone-200 p-2 text-center">
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/all-notifications" // A future page
                      className="cursor-pointer rounded-md p-2 text-sm font-medium text-amber-600 outline-none hover:bg-stone-50"
                    >
                      View all notifications
                    </Link>
                  </DropdownMenu.Item>
                </div>

              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          {/* --- END NOTIFICATION DROPDOWN --- */}

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