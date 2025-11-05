// src/components/layout/AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AppNavbar from './AppNavBar';


const AppLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      {/* Navbar on top */}
      <AppNavbar />
      
      <div className="flex h-full flex-1 overflow-hidden">
        {/* Sidebar on left */}
        <Sidebar />
        
        {/* Main content area, make it scrollable */}
        <main className="flex-1 overflow-y-auto bg-stone-100 p-6">
          <Outlet /> {/* This renders the matched child route */}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;