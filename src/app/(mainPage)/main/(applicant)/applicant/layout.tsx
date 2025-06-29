'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useApplicantStore from '@/zustand/useApplicantStore';
import Sidebar from './Sidebar';

const ApplicantLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { authUser, getLoggedInUser } = useApplicantStore();

    // Fetch authUser if not already loaded
    useEffect(() => {
        const checkUser = async () => {
            await getLoggedInUser();
        };
        checkUser();
    }, [getLoggedInUser]);

    // Redirect to homepage if not authenticated
    useEffect(() => {
        if (authUser === null) {
            router.push('/');
        }
    }, [authUser, router]);

    // Avoid rendering while loading auth status
    if (authUser === null) return null;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="w-64" /> {/* Spacer for Sidebar */}
            <main className="flex-1 bg-[#0F1120] text-white">
                {children}
            </main>
        </div>
    );
};

export default ApplicantLayout;
