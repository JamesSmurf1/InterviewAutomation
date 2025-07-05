'use client';
import React, { useEffect, useState } from 'react';
import useCompanyApiStore from '@/zustand/company/useCompanyApiStore';

const DashboardOverview = () => {
  const { getDashboardData } = useCompanyApiStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboardData();
      setStats(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0F1120] text-white">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 bg-[#0F1120] p-8 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Company Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card title="Total Jobs" value={stats.totalJobs} />
          <Card title="Total Applicants" value={stats.totalApplicants} />
          <Card title="Jobs with Applicants" value={stats.jobsWithApplicants} />
          <Card title="Jobs Missing Questions" value={stats.jobsNeedingQuestions} />
        </div>

        {/* Recent Jobs */}
        <Section title="Recent Job Listings">
          {stats.recentJobs.map((job: any) => (
            <div key={job._id} className="p-4 bg-[#1E2130] rounded-lg border border-gray-700 mb-3">
              <p className="text-lg font-semibold">{job.title}</p>
              <p className="text-sm text-gray-400">
                Applicants: {job.applicants?.length || 0} | Posted: {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </Section>
      </main>
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-[#1E2130] p-6 rounded-lg shadow border border-gray-700">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default DashboardOverview;
