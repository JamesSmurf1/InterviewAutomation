'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCompanyStore from '@/zustand/useCompanyStore';
import Link from 'next/link';

const Sidebar = () => {
  const router = useRouter();
  const { companyUser, getLoggedInCompany, logoutCompany } = useCompanyStore();

  // Fetch companyUser on mount
  useEffect(() => {
    if (!companyUser) {
      getLoggedInCompany();
    }
  }, [companyUser, getLoggedInCompany]);

  const handleLogout = async () => {
    await logoutCompany();
    router.push('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0D0F1A] text-white flex flex-col justify-between p-4">
      {/* Top Section */}
      <div>
        {/* Company Profile */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
            {companyUser?.companyName?.charAt(0) || 'C'}
          </div>
          <div>
            <p className="font-semibold">{companyUser?.companyName || 'Company'}</p>
            <p className="text-sm text-gray-400">COMPANY NAME</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2">
          <Link href="/main/company/dashboard-overview"><SidebarItem label="Dashboard Overview" /></Link>
          <Link href="/main/company/post-job"><SidebarItem label="Post a Job" /></Link>
          <Link href="/main/company/manage-listings"><SidebarItem label="Manage Listings" /></Link>
          <Link href="/main/company/view-applicants"><SidebarItem label="View Applicants" /></Link>
          <Link href="/main/company/messages"><SidebarItem label="Messages" /></Link>
          <Link href="/main/company/settings"><SidebarItem label="Settings" /></Link>
        </nav>
      </div>

      {/* Bottom Logout */}
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
  <button className="block w-full text-left px-3 py-2 rounded-lg hover:bg-[#1E2030] transition text-sm">
    {label}
  </button>
);

export default Sidebar;
