import React from 'react';
import Sidebar from './Sidebar';

const CompanyDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-[#0F1120] p-8 text-white">
        <h1 className="text-2xl font-bold">Company Dashboard</h1>
        {/* Your job posting form or dashboard widgets here */}
      </main>
    </div>
  );
};

export default CompanyDashboard;
