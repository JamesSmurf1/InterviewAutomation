'use client';
import React from 'react';
import Sidebar from './Sidebar';

const ApplicantDashboard = () => {
    return (
        <div className="flex w-[100vw] h-[100vh]">
            <Sidebar />
            <div className="flex-1 bg-red-50 p-6">
                <h1 className="text-2xl font-bold">Applicant Dashboard</h1>
                {/* Add your applicant dashboard content here */}
            </div>
        </div>
    );
};

export default ApplicantDashboard;
