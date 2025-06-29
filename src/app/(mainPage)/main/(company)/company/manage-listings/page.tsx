'use client'
import React, { useEffect, useState } from 'react';
import useCompanyApiStore from '@/zustand/company/useCompanyApiStore';
import toast from 'react-hot-toast';

const ManageListing = () => {
    const { myListings, getMyListing, patchJob, deleteJob } = useCompanyApiStore();
    const [editJobId, setEditJobId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        getMyListing();
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
        const confirm = window.confirm("Are you sure you want to delete this job?");
        if (!confirm) return;

        const toastId = toast.loading('Deleting job...');
        try {
            await deleteJob(id);
            toast.success('Deleted successfully!', { id: toastId });
        } catch {
            toast.error('Failed to delete', { id: toastId });
        }
    };

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
                                        <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <input name="position" value={formData.position} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <input name="type" value={formData.type} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <input name="salary" value={formData.salary} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="w-full p-2 bg-[#2C2F40] text-white rounded" />
                                        <button onClick={handleUpdate} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                                        <button onClick={() => setEditJobId(null)} className="text-sm text-red-400 ml-4">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-semibold">{job.title}</h2>
                                        <p className="text-sm text-gray-400">{job.position} • {job.type}</p>
                                        <p className="text-gray-300">{job.description}</p>
                                        <p className="text-sm text-gray-500">Location: {job.location}</p>
                                        {job.salary && <p className="text-sm text-gray-500">Salary: {job.salary}</p>}
                                        {job.requirements && <p className="text-sm text-gray-400"><strong className="text-white">Requirements:</strong> {job.requirements}</p>}
                                        <p className="text-xs text-gray-500">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                        <div className="flex gap-4 mt-2">
                                            <button onClick={() => handleEditClick(job)} className="text-sm text-blue-400">Edit</button>
                                            <button onClick={() => handleDelete(job._id)} className="text-sm text-red-400">Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageListing;
