'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/zustand/useAuthStore';

const Sidebar = () => {
    const { authUser, logoutFunction } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutFunction();
        router.push('/');
    };

    return (
        <aside className="w-64 min-h-screen bg-[#1A1A2E] text-white flex flex-col justify-between p-4">
            <div>
                {/* Applicant Profile */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold uppercase">
                        {authUser?.username?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <p className="font-semibold">
                            {authUser?.username || 'Applicant'}
                        </p>
                        <p className="text-sm text-gray-400">APPLICANT</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    <SidebarItem label="Dashboard Overview" />
                    <SidebarItem label="Search Jobs" />
                    <SidebarItem label="My Applications" />
                    <SidebarItem label="Saved Jobs" />
                    <SidebarItem label="Messages" />
                    <SidebarItem label="Settings" />
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
