import { create } from 'zustand';

interface ApplicantProps {
  jobs: any[];
  myApplications: any[],
  AvailableJobs: () => Promise<void>;
  ApplyJobs: (id: any) => Promise<void>
  GetMyApplications: () => Promise<void>;

}

const useApplicantApiStore = create<ApplicantProps>((set) => ({
  jobs: [],
  myApplications: [],

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
          'content-type': 'application/json'
        },
        body: JSON.stringify({ JobId: id })
      });
      const data = await res.json();
    } catch (error) {
      console.error(error)
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
}));

export default useApplicantApiStore;
