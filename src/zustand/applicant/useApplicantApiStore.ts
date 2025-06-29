import { create } from 'zustand';

interface ApplicantProps {
  jobs: any[];
  myApplications: any[];
  interviewQuestions: string[] | null;

  AvailableJobs: () => Promise<void>;
  ApplyJobs: (id: any) => Promise<void>;
  RemoveApplication: (id: any) => Promise<void>;
  GetMyApplications: () => Promise<void>;
  GetInterviewQuestions: (jobId: string) => Promise<void>;
}

const useApplicantApiStore = create<ApplicantProps>((set, get) => ({
  jobs: [],
  myApplications: [],
  interviewQuestions: null,

  AvailableJobs: async () => {
    try {
      const res = await fetch('/api/applicant/available-jobs');
      const data = await res.json();
      set({ jobs: data });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  },

  ApplyJobs: async (id: any) => {
    try {
      const res = await fetch('/api/applicant/apply-job', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ JobId: id }),
      });

      await get().AvailableJobs();
      await get().GetMyApplications();
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  },

  RemoveApplication: async (id: any) => {
    try {
      const res = await fetch('/api/applicant/apply-job', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ JobId: id }),
      });

      await get().GetMyApplications();
      await get().AvailableJobs();
    } catch (error) {
      console.error('Error unapplying from job:', error);
    }
  },

  GetMyApplications: async () => {
    try {
      const res = await fetch('/api/applicant/my-applications');
      const data = await res.json();
      set({ myApplications: data });
    } catch (error) {
      console.error('Error fetching my applications:', error);
    }
  },

  GetInterviewQuestions: async (jobId: string) => {
    try {
      const res = await fetch('/api/applicant/show-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch questions');
      }

      set({ interviewQuestions: data.questions });
    } catch (error) {
      console.error('Error fetching interview questions:', error);
      set({ interviewQuestions: null });
    }
  },

}));

export default useApplicantApiStore;
