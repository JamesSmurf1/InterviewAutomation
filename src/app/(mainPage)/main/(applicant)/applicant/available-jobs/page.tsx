'use client';
import React, { useEffect, useState } from 'react';
import useApplicantApiStore from '@/zustand/applicant/useApplicantApiStore';
import useApplicantStore from '@/zustand/useApplicantStore';
import toast from 'react-hot-toast';

const AvailableJobs = () => {
  const { jobs, AvailableJobs, ApplyJobs } = useApplicantApiStore();
  const { authUser, getLoggedInUser } = useApplicantStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([AvailableJobs(), getLoggedInUser()]);
      setLoading(false);
    };

    fetchData();
  }, [AvailableJobs, getLoggedInUser]);

  const handleSubmit = async (id: string) => {
    const toastId = toast.loading('Applying to job...');
    try {
      await ApplyJobs(id);
      toast.success('Successfully applied to job!', { id: toastId });
    } catch (error) {
      toast.error('Failed to apply to job', { id: toastId });
    }
  };

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => !job.applicants?.includes(authUser?._id))
    : [];

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
        <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-400">
              You’ve already applied to all available jobs.
            </p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-[#1E2130] p-5 rounded-lg border border-gray-700 shadow"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>

                {job?.posterId && (
                  <p className="text-sm text-gray-400 mb-1">
                    Posted by:{' '}
                    <span className="text-white font-medium">
                      {job.posterId?.companyName}
                    </span>
                  </p>
                )}

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
                    <span className="font-medium text-white">
                      Requirements:
                    </span>{' '}
                    {job.requirements}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <button
                  className="mt-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm cursor-pointer"
                  onClick={() => handleSubmit(job._id)}
                >
                  Apply Job
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AvailableJobs;
