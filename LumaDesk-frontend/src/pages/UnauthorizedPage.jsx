// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 text-center">
      <ShieldAlert className="h-16 w-16 text-rose-500" />
      <h1 className="mt-4 text-4xl font-bold text-stone-800">
        Access Denied
      </h1>
      <p className="mt-2 text-lg text-stone-600">
        You do not have the necessary permissions to view this page.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

export default UnauthorizedPage;