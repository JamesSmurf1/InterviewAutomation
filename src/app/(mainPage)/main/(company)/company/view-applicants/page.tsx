'use client';
import React, { useEffect, useState } from 'react';
import useCompanyApiStore from '@/zustand/company/useCompanyApiStore';
import toast from 'react-hot-toast';

const ViewApplicants = () => {
    const { myListings, getMyListing } = useCompanyApiStore();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await getMyListing();
            setLoading(false);
        };

        fetchData();
    }, [getMyListing]);

    const handleSelectJob = async (jobId: string) => {
        setSelectedJobId(jobId);
        setLoading(true);
        // const data = await getApplicantsByJob(jobId);
        // setApplicants(data);
        setLoading(false);
    };

    return (
        <div className="flex">
            <main className="flex-1 bg-[#0F1120] p-8 text-white min-h-screen">
                <h1 className="text-2xl font-bold mb-6">Applicants</h1>

                {/* Job Selector */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm text-gray-400">Select Job:</label>
                    <select
                        onChange={(e) => handleSelectJob(e.target.value)}
                        className="bg-[#1E2130] border border-gray-600 text-white px-4 py-2 rounded w-full"
                        value={selectedJobId ?? ''}
                    >
                        <option value="" disabled>
                            -- Choose a Job --
                        </option>
                        {myListings.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Applicant Cards */}
                {loading ? (
                    <div className="flex justify-center items-center">
                        <span className="loading loading-spinner loading-lg text-white" />
                    </div>
                ) : applicants.length === 0 && selectedJobId ? (
                    <p className="text-gray-400">No applicants yet for this job.</p>
                ) : (
                    <div className="space-y-4">
                        {applicants.map((applicant) => (
                            <div
                                key={applicant._id}
                                className="bg-[#1E2130] p-5 rounded-lg border border-gray-700 shadow"
                            >
                                <h2 className="text-xl font-semibold">
                                    {applicant.applicant?.name ?? 'Unknown Applicant'}
                                </h2>
                                <p className="text-sm text-gray-400">Position: {applicant.job?.position}</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Status:{' '}
                                    <span className="text-white capitalize">
                                        {applicant.status ?? 'Pending'}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Applied on: {new Date(applicant.createdAt).toLocaleDateString()}
                                </p>

                                <div className="flex gap-4 mt-4">
                                    <button className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm">
                                        View Answers
                                    </button>
                                    <button className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm">
                                        Invite for Interview
                                    </button>
                                    <button className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ViewApplicants;
