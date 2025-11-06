// src/components/layout/AppLayout.jsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavBar';
import Sidebar from './Sidebar';

import { Client } from '@stomp/stompjs';
import { Toaster, toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { BellRing } from 'lucide-react';

const AppLayout = () => {
  const { user } = useAuth(); // Get the logged-in user

  useEffect(() => {
    if (!user || !user.userId) {
      return; // Wait for a user to be available
    }

    const brokerURL = 'ws://localhost:8080/ws';

    const client = new Client({
      brokerURL: brokerURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log(new Date(), str);
      },
    });

    client.onConnect = (frame) => {
      console.log('WebSocket Connected:', frame);
      
      const subscriptionTopic = `/user/${user.userId}/queue/notifications`;

      client.subscribe(subscriptionTopic, (message) => {
        if (message.body) {
          const notification = JSON.parse(message.body);
          
          toast.info(notification.subject, {
            description: notification.message,
            icon: <BellRing className="h-5 w-5" />,
          });
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();

    // Cleanup function
    return () => {
      client.deactivate();
      console.log('WebSocket Disconnected');
    };
    
  // --- THIS IS THE FIX ---
  // Depend on the *stable* userId, not the unstable 'user' object reference.
  }, [user?.userId]); 
  // --- END FIX ---

  return (
    <div className="flex h-screen flex-col">
      <Toaster position="top-right" richColors />
      <AppNavbar />
      
      <div className="flex h-full flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-stone-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;