'use client';
import React from 'react';
import Sidebar from './Sidebar';

const ApplicantLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className='w-64'></div>
            <main className="flex-1 bg-[#0F1120] text-white">
                {children}
            </main>
        </div>
    );
};

export default ApplicantLayout;
