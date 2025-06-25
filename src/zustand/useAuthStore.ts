

import { create } from 'zustand'

interface AuthStore {
    authUser: any,
    getLoggedInUser: () => Promise<any>,
    loginFunction: (username: string, password: string) => Promise<any>,
    registerFunction: (username: string, password: string) => Promise<any>
    logoutFunction: () => Promise<any>
}

const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    getLoggedInUser: async () => {
        try {
            let res = await fetch('/api/auth/me');
            if (!res.ok) {
                set({ authUser: null });
                return null;
            }
            const data = await res.json();
            set({ authUser: data });
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    loginFunction: async (username, password) => {
        try {
            let res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()
            if (!res.ok) return data
            set({ authUser: data })
            return data
        } catch (error) {
            console.log(error)
        }
    },
    registerFunction: async (username, password) => {
        try {
            let res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()
            if (!res.ok) return data
            return data
        } catch (error) {
            console.log(error)
        }
    },
    logoutFunction: async () => {
        try {
            let res = await fetch('/api/auth/logout')
            set({ authUser: null })
        } catch (error) {
            console.log(error)
        }
    }
}))

export default useAuthStore