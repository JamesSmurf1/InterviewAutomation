'use client';
import React, { useEffect, useState } from 'react';
import useCompanyApiStore from '@/zustand/company/useCompanyApiStore';
import toast from 'react-hot-toast';

const ViewApplicants = () => {
  const { myListings, getMyListing, getApplicantsOnJob, viewQuestion, setStatus } = useCompanyApiStore();

  const [applicants, setApplicants] = useState<any[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedApplicantId, setExpandedApplicantId] = useState<string | null>(null);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getMyListing();
      setLoading(false);
    };
    fetchData();
  }, [getMyListing]);

  const handleStatus = (status: string, applicantId: any, listingId: any) => {
    setStatus(status, applicantId, listingId)

    console.log(status)
  }

  const handleSelectJob = async (jobId: string) => {
    setSelectedJobId(jobId);
    setLoading(true);
    setInterviewQuestions([]);
    setQuestionsLoaded(false);
    const data = await getApplicantsOnJob(jobId);
    if (data) {
      setApplicants(data);
    } else {
      toast.error('Failed to fetch applicants for this job.');
      setApplicants([]);
    }
    setLoading(false);
    setExpandedApplicantId(null);
  };

  const toggleAnswers = (applicantId: string) => {
    setExpandedApplicantId((prev) => (prev === applicantId ? null : applicantId));
  };

  const handleToggleQuestions = async () => {

    console.log(selectedJobId)
    if (!selectedJobId) return;

    if (questionsLoaded) {
      setInterviewQuestions([]);
      setQuestionsLoaded(false);
      return;
    }

    const data = await viewQuestion(selectedJobId);

    if (Array.isArray(data)) {
      setInterviewQuestions(data);
      setQuestionsLoaded(true);
    } else {
      toast.error('Failed to load interview questions.');
    }
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
            {applicants.map((applicant: any) => {
              const isExpanded = expandedApplicantId === applicant._id;

              return (
                <div
                  key={applicant._id}
                  className="bg-[#1E2130] p-5 rounded-lg border border-gray-700 shadow"
                >
                  <h2 className="text-xl font-semibold">
                    {applicant.applicant?.username ?? 'Unknown Applicant'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Answers submitted: {applicant.answers?.length ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Applied on: {new Date(applicant.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-4 mt-4 flex-wrap">
                    <button
                      onClick={() => toggleAnswers(applicant._id)}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm"
                    >
                      {isExpanded ? 'Hide Answers' : 'View Answers'}
                    </button>

                    <button
                      onClick={handleToggleQuestions}
                      className="bg-yellow-600 text-white px-5 py-2 rounded-lg text-sm"
                    >
                      {questionsLoaded ? 'Hide Questions' : 'Show Questions'}
                    </button>

                    <button className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm" onClick={() => handleStatus('Accepted', applicant._id, selectedJobId)}>
                      Accept
                    </button>
                    <button className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm" onClick={() => handleStatus('Reject', applicant._id, selectedJobId)}>
                      Reject
                    </button>
                  </div>

                  {/* Answers + Questions Section */}
                  {isExpanded && (
                    <div className="mt-4 space-y-2 text-sm text-white border-t border-gray-600 pt-4">
                      {(applicant.answers || []).map((answer: string, index: number) => (
                        <div key={index} className="mb-2">
                          {questionsLoaded && interviewQuestions[index] && (
                            <p className="text-gray-400 font-medium">
                              Q{index + 1}: {interviewQuestions[index]}
                            </p>
                          )}
                          <p className="text-white ml-2">
                            <span className="text-green-400">Answer:</span> {answer}
                          </p>
                        </div>
                      ))}
                      {(!applicant.answers || applicant.answers.length === 0) && (
                        <p className="text-gray-400 italic">No answers submitted.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewApplicants;
