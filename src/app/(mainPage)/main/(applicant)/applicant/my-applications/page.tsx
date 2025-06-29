'use client';
import React, { useEffect } from 'react';
import useApplicantStore from '@/zustand/useApplicantStore';
import useApplicantApiStore from '@/zustand/applicant/useApplicantApiStore';

const MyApplications = () => {
    const { authUser, getLoggedInUser } = useApplicantStore();
    const { myApplications, GetMyApplications } = useApplicantApiStore();

    useEffect(() => {
        getLoggedInUser();
        GetMyApplications();
    }, [getLoggedInUser, GetMyApplications]);

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
                                <p className="text-sm text-gray-400 mt-1">
                                    Status: <span className="text-white">Pending</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Applied on: {new Date(job.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyApplications;
