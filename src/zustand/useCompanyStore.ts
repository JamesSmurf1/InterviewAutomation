// store/useCompanyStore.ts
import { create } from 'zustand';

interface CompanyStore {
    companyUser: any;
    getLoggedInCompany: () => Promise<any>;
    registerCompany: (companyName: string, password: string) => Promise<any>;
    loginCompany: (companyName: string, password: string) => Promise<any>;
    logoutCompany: () => Promise<void>;
}

const useCompanyStore = create<CompanyStore>((set, get) => ({
    companyUser: null,

    getLoggedInCompany: async () => {
        try {
            const res = await fetch('/api/company/me');

            if (!res.ok) {
                set({ companyUser: null });
                return null;
            }

            const data = await res.json();
            set({ companyUser: data });
            return data;
        } catch (error) {
            console.error('Get Company Error:', error);
            set({ companyUser: null });
            return null;
        }
    },
    registerCompany: async (companyName, password) => {
        try {
            const res = await fetch('/api/company/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName, password }),
            });
            const data = await res.json();
            if (!res.ok) return { error: data?.error };
            return data;
        } catch (error) {
            console.error('Register Error:', error);
        }
    },

    loginCompany: async (companyName, password) => {
        try {
            const res = await fetch('/api/company/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName, password }),
            });
            const data = await res.json();
            console.log(data)
            if (!res.ok) return { error: data?.error };
            set({ companyUser: data });
            return data;
        } catch (error) {
            console.error('Login Error:', error);
        }
    },

    logoutCompany: async () => {
        try {
            await fetch('/api/company/logout');
            set({ companyUser: null });
        } catch (error) {
            console.error('Logout Error:', error);
        }
    },
}));

export default useCompanyStore;
