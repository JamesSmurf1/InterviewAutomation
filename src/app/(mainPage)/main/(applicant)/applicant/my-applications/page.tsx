'use client';
import React, { useEffect, useState } from 'react';
import useApplicantStore from '@/zustand/useApplicantStore';
import useApplicantApiStore from '@/zustand/applicant/useApplicantApiStore';
import toast from 'react-hot-toast';

const MyApplications = () => {
    const { authUser, getLoggedInUser } = useApplicantStore();
    const { myApplications, GetMyApplications, RemoveApplication } = useApplicantApiStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            await Promise.all([getLoggedInUser(), GetMyApplications()]);
            setLoading(false);
        };

        fetchApplications();
    }, [getLoggedInUser, GetMyApplications]);

    const handleUnapply = async (jobId: string) => {
        const toastId = toast.loading('Removing application...');
        try {
            await RemoveApplication(jobId);
            toast.success('Application removed successfully!', { id: toastId });
        } catch (error) {
            toast.error('Failed to remove application', { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0F1120]">
                <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
        );
    }

    return (
        <div className="flex">
            <main className="flex-1 bg-[#0F1120] p-8 text-white min-h-screen">
                <h1 className="text-2xl font-bold mb-6">My Applications</h1>

                <div className="space-y-4">
                    {myApplications.length === 0 ? (
                        <p className="text-gray-400">You haven't applied to any jobs yet.</p>
                    ) : (
                        myApplications.map((job) => (
                            <div
                                key={job._id}
                                className="bg-[#1E2130] p-5 rounded-lg border border-gray-700 shadow"
                            >
                                <h2 className="text-xl font-semibold">{job.title}</h2>

                                <p className="text-sm text-gray-400 mb-1">
                                    Company: <span className="text-white">{job?.posterId?.companyName}</span>
                                </p>

                                <p className="text-sm text-gray-400">
                                    {job.position} • {job.type}
                                </p>

                                <p className="mt-2 text-gray-300">{job.description}</p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Location: {job.location}
                                </p>

                                {job.salary && (
                                    <p className="text-sm text-gray-500">Salary: {job.salary}</p>
                                )}

                                {job.requirements && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        <span className="font-medium text-white">Requirements:</span>{' '}
                                        {job.requirements}
                                    </p>
                                )}

                                <p className="text-sm text-gray-400 mt-1">
                                    Status: <span className="text-white">Pending</span>
                                </p>

                                <p className="text-xs text-gray-500 mt-2">
                                    Applied on: {new Date(job.createdAt).toLocaleDateString()}
                                </p>

                                <button
                                    onClick={() => handleUnapply(job._id)}
                                    className="mt-3 bg-red-500 hover:bg-red-400 text-white px-[25px] py-[15px] rounded-lg text-sm cursor-pointer"
                                >
                                    Unapply
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyApplications;
