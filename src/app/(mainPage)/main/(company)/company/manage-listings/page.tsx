'use client';
import React, { useEffect, useState } from 'react';
import useCompanyApiStore from '@/zustand/company/useCompanyApiStore';
import toast from 'react-hot-toast';

const ManageListing = () => {
    const {
        myListings,
        getMyListing,
        patchJob,
        deleteJob,
    } = useCompanyApiStore();

    const [editJobId, setEditJobId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [questionsModal, setQuestionsModal] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            await getMyListing();
            setLoading(false);
        };

        fetchListings();
    }, [getMyListing]);

    const handleEditClick = (job: any) => {
        setEditJobId(job._id);
        setFormData({ ...job });
    };

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const toastId = toast.loading('Updating job...');
        try {
            await patchJob(editJobId!, formData);
            toast.success('Updated successfully!', { id: toastId });
            setEditJobId(null);
        } catch {
            toast.error('Failed to update', { id: toastId });
        }
    };

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('Are you sure you want to delete this job?');
        if (!confirm) return;

        const toastId = toast.loading('Deleting job...');
        try {
            await deleteJob(id);
            toast.success('Deleted successfully!', { id: toastId });
        } catch {
            toast.error('Failed to delete', { id: toastId });
        }
    };

    const generateInterviewQuestions = async (jobId: string) => {
        const toastId = toast.loading('Generating questions...');
        try {
            const res = await fetch('/api/company/interview-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId }),
            });

            const data = await res.json();

            if (data.questions) {
                setQuestionsModal(data.questions);
                toast.success('Questions generated!', { id: toastId });
            } else {
                toast.error('Failed to generate questions', { id: toastId });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error generating questions', { id: toastId });
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
                <h1 className="text-2xl font-bold mb-6">Your Job Listings</h1>

                <div className="space-y-4">
                    {myListings.length === 0 ? (
                        <p className="text-gray-400">You haven't posted any jobs yet.</p>
                    ) : (
                        myListings.map((job) => (
                            <div
                                key={job._id}
                                className="bg-[#1E2130] p-5 rounded-lg border border-gray-700 shadow space-y-3"
                            >
                                {editJobId === job._id ? (
                                    <>
                                        {['title', 'position', 'type', 'location', 'salary', 'description', 'requirements'].map((field) =>
                                            field === 'description' || field === 'requirements' ? (
                                                <textarea
                                                    key={field}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    className="w-full p-2 bg-[#2C2F40] text-white rounded"
                                                />
                                            ) : (
                                                <input
                                                    key={field}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    className="w-full p-2 bg-[#2C2F40] text-white rounded"
                                                />
                                            )
                                        )}
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-blue-600 text-white px-[25px] py-[15px] rounded cursor-pointer rounded-lg"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditJobId(null)}
                                            className="text-sm bg-red-400 text-white px-[25px] py-[15px] ml-4 cursor-pointer rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-semibold">{job.title}</h2>
                                        <p className="text-sm text-gray-400">{job.position} • {job.type}</p>
                                        <p className="text-gray-300">{job.description}</p>
                                        <p className="text-sm text-gray-500">Location: {job.location}</p>
                                        {job.salary && <p className="text-sm text-gray-500">Salary: {job.salary}</p>}
                                        {job.requirements && (
                                            <p className="text-sm text-gray-400">
                                                <strong className="text-white">Requirements:</strong> {job.requirements}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>

                                        <div className="flex flex-wrap gap-4 mt-4">
                                            <button
                                                onClick={() => handleEditClick(job)}
                                                className="text-sm bg-blue-400 text-white px-[25px] py-[15px] rounded-lg cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="text-sm bg-red-400 text-white px-[25px] py-[15px] rounded-lg cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                            <label
                                                htmlFor="questions-modal"
                                                onClick={() => generateInterviewQuestions(job._id)}
                                                className="text-sm bg-green-500 text-white px-[25px] py-[15px] rounded-lg cursor-pointer"
                                            >
                                                Generate Interview
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* DaisyUI Modal */}
                <input type="checkbox" id="questions-modal" className="modal-toggle" checked={!!questionsModal} readOnly />
                <div className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box bg-[#1E2130] text-white">
                        <h3 className="font-bold text-lg mb-4">Generated Interview Questions</h3>
                        {Array.isArray(questionsModal) && (
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {questionsModal.map((q, idx) => (
                                    <li key={idx}>{q}</li>
                                ))}
                            </ul>
                        )}
                        <div className="modal-action">
                            <label
                                htmlFor="questions-modal"
                                onClick={() => setQuestionsModal(null)}
                                className="btn btn-sm btn-primary"
                            >
                                Close
                            </label>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageListing;
