'use client';
import React, { useEffect, useState } from 'react';
import useApplicantApiStore from '@/zustand/applicant/useApplicantApiStore';

const DashboardOverview = () => {
    const { getDashboardData } = useApplicantApiStore();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ totalApplications: number } | null>(null);

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
                <h1 className="text-3xl font-bold mb-6">Applicant Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card title="Jobs You've Applied To" value={stats.totalApplications} />
                </div>
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

export default DashboardOverview;
