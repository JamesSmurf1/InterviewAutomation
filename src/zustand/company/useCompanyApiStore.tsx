import { create } from 'zustand';
import toast from 'react-hot-toast';

interface CompanyProps {
  postAJob: (formData: any) => Promise<any>;
  myListings: any[];
  getMyListing: () => Promise<void>;
  patchJob: (jobId: string, updates: any) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  generateInterviewQuestions: (jobId: string) => Promise<string[] | null>;
}

const useCompanyApiStore = create<CompanyProps>((set, get) => ({
  postAJob: async (formData: any) => {
    try {
      const res = await fetch('/api/company/post-a-job', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  },

  myListings: [],

  getMyListing: async () => {
    try {
      const res = await fetch('/api/company/manage-listing');
      const data = await res.json();
      set({ myListings: data });
    } catch (err) {
      console.error('Error fetching listings:', err);
    }
  },

  patchJob: async (jobId, updates) => {
    try {
      const res = await fetch('/api/company/manage-listing', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, updates }),
      });

      if (!res.ok) throw new Error('Failed to update job');

      const updatedJob = await res.json();
      const current = get().myListings;
      const updatedList = current.map((job) =>
        job._id === updatedJob._id ? updatedJob : job
      );

      set({ myListings: updatedList });
    } catch (err) {
      console.error('Error updating job:', err);
    }
  },

  deleteJob: async (jobId) => {
    try {
      const res = await fetch(`/api/company/manage-listing?jobId=${jobId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete job');

      set((state) => ({
        myListings: state.myListings.filter((job) => job._id !== jobId),
      }));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  },

  generateInterviewQuestions: async (jobId) => {
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
        toast.success('Questions generated!', { id: toastId });
        return data.questions;
      } else {
        toast.error('Failed to generate questions', { id: toastId });
        return null;
      }
    } catch (err) {
      console.error(err);
      toast.error('Error generating questions', { id: toastId });
      return null;
    }
  },
}));

export default useCompanyApiStore;
