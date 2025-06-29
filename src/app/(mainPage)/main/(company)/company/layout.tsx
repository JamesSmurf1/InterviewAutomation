'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCompanyStore from '@/zustand/useCompanyStore';
import Sidebar from './Sidebar'; // adjust the path if needed

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
    const { companyUser, getLoggedInCompany } = useCompanyStore();
    const router = useRouter();

    // Fetch company info on layout mount
    useEffect(() => {
        const check = async () => {
            await getLoggedInCompany();
        };
        check();
    }, [getLoggedInCompany]);

    // Redirect if not logged in
    useEffect(() => {
        if (companyUser === null) {
            router.push('/');
        }
    }, [companyUser, router]);

    // Avoid flashing content while checking auth
    if (companyUser === null) return null;

    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1">{children}</main>
        </div>
    );
};

export default CompanyLayout;
