import { create } from 'zustand';

interface CompanyProps {
  postAJob: (formData: any) => Promise<any>;
  myListings: any[];
  getMyListing: () => Promise<void>;
  patchJob: (jobId: string, updates: any) => Promise<boolean>;
  deleteJob: (jobId: string) => Promise<boolean>;
  generateInterviewQuestions: (jobId: string) => Promise<string[] | null>;
  deleteInterviewQuestions: (jobId: string) => Promise<boolean>;
  getInterviewQuestions: (jobId: string) => Promise<string[] | null>;
  getApplicantsOnJob: (jobId: string) => Promise<string[] | null>;
}

const useCompanyApiStore = create<CompanyProps>((set, get) => ({
  myListings: [],

  postAJob: async (formData: any) => {
    try {
      const res = await fetch('/api/company/post-a-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      return await res.json();
    } catch (error) {
      console.error('Error posting job:', error);
      throw error;
    }
  },

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

      if (!res.ok) return false;

      const updatedJob = await res.json();
      const current = get().myListings;
      const updatedList = current.map((job) =>
        job._id === updatedJob._id ? updatedJob : job
      );

      set({ myListings: updatedList });
      return true;
    } catch (err) {
      console.error('Error updating job:', err);
      return false;
    }
  },

  deleteJob: async (jobId) => {
    try {
      const res = await fetch(`/api/company/manage-listing?jobId=${jobId}`, {
        method: 'DELETE',
      });

      if (!res.ok) return false;

      set((state) => ({
        myListings: state.myListings.filter((job) => job._id !== jobId),
      }));
      return true;
    } catch (err) {
      console.error('Error deleting job:', err);
      return false;
    }
  },

  generateInterviewQuestions: async (jobId) => {
    try {
      const res = await fetch('/api/company/interview-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();
      return data.questions ?? null;
    } catch (err) {
      console.error('Error generating questions:', err);
      return null;
    }
  },

  deleteInterviewQuestions: async (jobId) => {
    try {
      const res = await fetch(`/api/company/interview-questions?jobId=${jobId}`, {
        method: 'DELETE',
      });

      if (!res.ok) return false;

      await get().getMyListing(); // Refresh listings after deletion
      return true;
    } catch (err) {
      console.error('Error deleting questions:', err);
      return false;
    }
  },

  // New method to GET interview questions
  getInterviewQuestions: async (jobId) => {
    try {
      const res = await fetch(`/api/company/interview-questions?jobId=${jobId}`, {
        method: 'GET',
      });

      if (!res.ok) {
        console.error('Failed to fetch interview questions');
        return null;
      }

      const data = await res.json();
      return data.questions ?? null;
    } catch (err) {
      console.error('Error fetching interview questions:', err);
      return null;
    }
  },

  getApplicantsOnJob: async (jobId) => {
    try {
      const res = await fetch(`/api/company/view-answers`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ listingId: jobId }) // ✅ fix: send listingId!
      });

      if (!res.ok) {
        console.error('Failed to fetch applicants');
        return null;
      }

      const data = await res.json();
      return data.applicants ?? [];
    } catch (err) {
      console.error('Error fetching applicants:', err);
      return null;
    }
  }


}));

export default useCompanyApiStore;
