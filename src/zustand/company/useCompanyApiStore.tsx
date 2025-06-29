import { create } from 'zustand';

interface CompanyProps {
  postAJob: (formData: any) => Promise<any>;
  myListings: any[];
  getMyListing: () => Promise<void>;
  patchJob: (jobId: string, updates: any) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>; // ✅ Add this
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

      if (!res.ok) {
        throw new Error('Failed to update job');
      }

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

  // ✅ DELETE JOB HANDLER
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
}));

export default useCompanyApiStore;
