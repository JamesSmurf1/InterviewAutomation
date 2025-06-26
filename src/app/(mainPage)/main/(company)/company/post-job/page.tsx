'use client';
import React, { useState } from 'react';

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    type: 'Full-time',
    location: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted job:', formData);

    // TODO: connect to backend or Zustand action here
    // e.g., await postJob(formData);
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
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition"
          >
            Post Job
          </button>
        </form>
      </main>
    </div>
  );
};

export default PostJobPage;
