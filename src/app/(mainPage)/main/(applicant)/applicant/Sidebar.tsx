'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useApplicantStore from '@/zustand/useApplicantStore';
import Link from 'next/link';

const Sidebar = () => {
  const { authUser, getLoggedInUser, logoutFunction } = useApplicantStore();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      getLoggedInUser();
    }
  }, [authUser, getLoggedInUser]);

  const handleLogout = async () => {
    await logoutFunction();
    router.push('/');
  };

  return (
    <aside className="w-64 h-[100vh] fixed bg-[#0D0F1A] text-white flex flex-col justify-between p-4">
      <div>
        {/* Applicant Profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold uppercase">
            {authUser?.username?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-semibold">{authUser?.username || 'Applicant'}</p>
            <p className="text-sm text-gray-400">APPLICANT</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link href="/main/applicant/dashboard-overview">
            <SidebarItem label="Dashboard Overview" />
          </Link>
          <Link href="/main/applicant/available-jobs">
            <SidebarItem label="Available Jobs" />
          </Link>
          <Link href="/main/applicant/my-applications">
            <SidebarItem label="My Applications" />
          </Link>
          <Link href="/main/applicant/saved-jobs">
            <SidebarItem label="Saved Jobs" />
          </Link>
          <Link href="/main/applicant/messages">
            <SidebarItem label="Messages" />
          </Link>
          <Link href="/main/applicant/settings">
            <SidebarItem label="Settings" />
          </Link>
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full text-sm px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

const SidebarItem = ({ label }: { label: string }) => (
  <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-[#2A2A40] transition text-sm">
    {label}
  </button>
);

export default Sidebar;
