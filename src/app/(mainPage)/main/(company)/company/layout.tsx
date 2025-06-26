'use client';
import React from 'react';
import Sidebar from './Sidebar';

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className='w-64'></div>
            <main className="flex-1 bg-[#0F1120] p-8 text-white">
                {children}
            </main>
        </div>
    );
};

export default CompanyLayout;
