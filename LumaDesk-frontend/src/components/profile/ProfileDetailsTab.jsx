// src/components/profile/ProfileDetailsTab.jsx
import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../../api/userService';
import { Loader2, AlertCircle } from 'lucide-react';

// Simple helper component (with a small tweak for empty values)
const InfoRow = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-stone-500">{label}</dt>
    <dd className="mt-1 text-sm text-stone-800 sm:col-span-2 sm:mt-0">
      {value || 'N/A'}
    </dd>
  </div>
);

export const ProfileDetailsTab = ({ user }) => {
  // 'user' prop comes from useAuth(), passed by ProfilePage
  
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) {
        setError("Critical error: User ID not found.");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await getUserProfile(user.userId);
        setProfileData(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Could not load your profile details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.userId]); // Re-fetch if the user ID ever changes

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center rounded-lg bg-rose-50 p-4 text-rose-600">
        <AlertCircle className="mr-3 h-6 w-6" />
        <p>{error}</p>
      </div>
    );
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  // --- Success State ---
  return (
    <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-stone-800">
        Personal Information
      </h3>
      <div className="mt-4 divide-y divide-stone-200">
        <InfoRow label="Full Name" value={profileData.fullName} />
        <InfoRow label="Email" value={profileData.email} />
        <InfoRow label="Phone Number" value={profileData.phoneNumber} />
        <InfoRow label="User ID" value={profileData.userId} />
        <InfoRow label="Role" value={user.role} /> {/* We still get role from auth */}
        <InfoRow label="Address" value={profileData.address} />
        <InfoRow label="Area" value={profileData.area} />
        <InfoRow label="Pin Code" value={profileData.pinCode} />
        <InfoRow 
          label="Member Since" 
          value={new Date(profileData.createdAt).toLocaleDateString('en-IN')} 
        />

        {/* --- YOUR CONDITIONAL LOGIC ---
          Show these fields *only if* the role is NOT ROLE_CUSTOMER.
        */}
        {user.role !== 'ROLE_CUSTOMER' && (
          <>
            <InfoRow label="Employee ID" value={profileData.employeeId} />
            <InfoRow label="Team ID" value={profileData.teamId} />
          </>
        )}
      </div>
    </div>
  );
};