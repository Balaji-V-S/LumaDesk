// src/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import * as Tabs from '@radix-ui/react-tabs';
import { User, Home, Lock } from 'lucide-react';

// We'll create these components next
import { ProfileDetailsTab } from '../components/profile/ProfileDetailsTab';
import { ChangeAddressForm } from '../components/profile/ChangeAddressForm';
import { ResetPasswordForm } from '../components/profile/ResetPasswordForm';

// Helper for Radix Tabs
const TabTrigger = ({ value, icon: Icon, children }) => (
  <Tabs.Trigger
    value={value}
    className="group flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-600 outline-none transition-all data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:text-amber-600 hover:text-stone-800"
  >
    <Icon className="h-5 w-5" />
    {children}
  </Tabs.Trigger>
);

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>; // Or a loader
  }

  return (
    <div className="max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-stone-800">
        My Profile
      </h1>
      <p className="mb-6 text-lg text-stone-600">
        Manage your personal information and account security.
      </p>

      <Tabs.Root defaultValue="details" className="w-full">
        <Tabs.List className="flex border-b border-stone-200">
          <TabTrigger value="details" icon={User}>
            Profile Details
          </TabTrigger>
          <TabTrigger value="address" icon={Home}>
            Change Address
          </TabTrigger>
          <TabTrigger value="security" icon={Lock}>
            Security
          </TabTrigger>
        </Tabs.List>

        <div className="pt-6">
          <Tabs.Content value="details">
            <ProfileDetailsTab user={user} />
          </Tabs.Content>
          <Tabs.Content value="address">
            <ChangeAddressForm user={user} />
          </Tabs.Content>
          <Tabs.Content value="security">
            <ResetPasswordForm user={user} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default ProfilePage;