'use client';
import React, { useEffect, useState } from 'react';
import useApplicantStore from '@/zustand/useApplicantStore';
import useApplicantApiStore from '@/zustand/applicant/useApplicantApiStore';
import toast from 'react-hot-toast';

const MyApplications = () => {
    const { getLoggedInUser } = useApplicantStore();
    const {
        myApplications,
        GetMyApplications,
        RemoveApplication,
        GetInterviewQuestions,
        interviewQuestions,
    } = useApplicantApiStore();

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

    const handleTakeInterview = async (jobId: string) => {
        const toastId = toast.loading('Fetching interview...');
        try {
            await GetInterviewQuestions(jobId);
            toast.success('Interview questions loaded!', { id: toastId });
        } catch {
            toast.error('Failed to load interview questions', { id: toastId });
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
                                    Company:{' '}
                                    <span className="text-white">{job?.posterId?.companyName}</span>
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

                                <div className="flex gap-[15px] flex-wrap mt-4">
                                    <button
                                        onClick={() => handleUnapply(job._id)}
                                        className="bg-red-500 hover:bg-red-400 text-white px-[25px] py-[15px] rounded-lg text-sm"
                                    >
                                        Unapply
                                    </button>

                                    {Array.isArray(job.interviewQuestions) &&
                                        job.interviewQuestions.length > 0 && (
                                            <button
                                                onClick={() => handleTakeInterview(job._id)}
                                                className="bg-blue-500 hover:bg-blue-400 text-white px-[25px] py-[15px] rounded-lg text-sm"
                                            >
                                                Take Interview
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal for Interview Questions */}
                {interviewQuestions && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                        <div className="bg-[#1E2130] p-6 rounded-lg w-[90%] max-w-xl text-white">
                            <h2 className="text-lg font-bold mb-4">Interview Questions</h2>
                            <ul className="list-disc space-y-2 text-sm pl-5 max-h-[300px] overflow-y-auto">
                                {interviewQuestions.map((q, idx) => (
                                    <li key={idx}>{q}</li>
                                ))}
                            </ul>
                            <div className="mt-6 text-right">
                                <button
                                    onClick={() =>
                                        useApplicantApiStore.setState({ interviewQuestions: null })
                                    }
                                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyApplications;
