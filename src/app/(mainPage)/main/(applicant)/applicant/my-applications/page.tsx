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
    submitAnswer,
  } = useApplicantApiStore();

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await getLoggedInUser();
      setCurrentUserId(user?._id); // assumes returned object has _id
      await GetMyApplications();
      setLoading(false);
    };
    fetchData();
  }, [getLoggedInUser, GetMyApplications]);

  useEffect(() => {
    if (interviewQuestions) {
      setAnswers(Array(interviewQuestions.length).fill(''));
    }
  }, [interviewQuestions]);

  const handleUnapply = async (jobId: string) => {
    const toastId = toast.loading('Removing application...');
    try {
      await RemoveApplication(jobId);
      toast.success('Application removed successfully!', { id: toastId });
    } catch {
      toast.error('Failed to remove application', { id: toastId });
    }
  };

  const handleTakeInterview = async (jobId: string) => {
    setSelectedJobId(jobId);
    const toastId = toast.loading('Fetching interview...');
    try {
      await GetInterviewQuestions(jobId);
      toast.success('Interview questions loaded!', { id: toastId });
    } catch {
      toast.error('Failed to load interview questions', { id: toastId });
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmitInterview = async () => {
    const toastId = toast.loading('Submitting answers...');
    try {
      if (!selectedJobId || !currentUserId) {
        toast.error('Missing job or user information', { id: toastId });
        return;
      }

      await submitAnswer(answers, selectedJobId, currentUserId);
      toast.success('Answers submitted successfully!', { id: toastId });
      useApplicantApiStore.setState({ interviewQuestions: null });
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Failed to submit answers', { id: toastId });
    }
  };

  const allAnswered = answers.every((a) => a.trim().length > 0);

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
            myApplications.map((job) => {
              const applicant = job.applicants.find(
                (a: any) => a.applicant === currentUserId
              );
              const hasAnswered = applicant?.answers?.length > 0;

              return (
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
                          onClick={() => {
                            if (!hasAnswered) handleTakeInterview(job._id);
                          }}
                          disabled={hasAnswered}
                          className={`px-[25px] py-[15px] rounded-lg text-sm ${
                            hasAnswered
                              ? 'bg-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-400 text-white'
                          }`}
                        >
                          {hasAnswered ? 'Interview Submitted' : 'Take Interview'}
                        </button>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Interview Modal */}
        {interviewQuestions && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-[#1E2130] p-6 rounded-lg w-[90%] max-w-xl text-white">
              <h2 className="text-lg font-bold mb-4">Interview Questions</h2>
              <form className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {interviewQuestions.map((q, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium mb-1">{q}</label>
                    <textarea
                      rows={3}
                      className="w-full bg-[#2C2F40] text-white p-2 rounded resize-none"
                      placeholder="Type your answer here..."
                      value={answers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    />
                  </div>
                ))}
              </form>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleSubmitInterview}
                  className={`px-4 py-2 rounded ${
                    allAnswered
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!allAnswered}
                >
                  Submit
                </button>
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
