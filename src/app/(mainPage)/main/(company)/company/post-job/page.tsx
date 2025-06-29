'use client';
import React, { useState } from 'react';
import useCompanyApiStore from '@/zustand/company/useCompanyApiStore';
import toast from 'react-hot-toast';

const PostJobPage = () => {
  const { postAJob } = useCompanyApiStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    position: '',
    type: 'Full-time',
    location: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading('Posting job...');

    try {
      await postAJob(formData);
      toast.success('Job posted successfully!', { id: toastId });

      setFormData({
        title: '',
        position: '',
        type: 'Full-time',
        location: '',
        salary: '',
        description: '',
        requirements: '',
      });
    } catch (error) {
      toast.error('Failed to post job.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex">
      <main className="flex-1 bg-[#0F1120] p-8 text-white">
        <h1 className="text-2xl font-bold mb-6">Post a Job</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

          <div>
            <label className="block mb-1 text-sm">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
              placeholder="e.g. $3000/month"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded bg-[#1E2130] text-white border border-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                &nbsp;Posting...
              </>
            ) : (
              'Post Job'
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PostJobPage;
