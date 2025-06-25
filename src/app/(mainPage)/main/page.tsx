'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/zustand/useAuthStore';
import useCompanyStore from '@/zustand/useCompanyStore';
import ApplicantDashboard from './(applicant)/ApplicantDashboard';
import CompanyDashboard from './(company)/CompanyDashboard';

const Page = () => {
  const router = useRouter();

  const {
    authUser,
    getLoggedInUser,
    logoutFunction
  } = useAuthStore();

  const {
    companyUser,
    getLoggedInCompany,
    logoutCompany
  } = useCompanyStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndValidate = async () => {
      const company = await getLoggedInCompany();
      const user = await getLoggedInUser();

      if (!user && !company) {
        router.replace('/');
      } else {
        setLoading(false);
      }
    };

    fetchAndValidate();
  }, [getLoggedInUser, getLoggedInCompany, router]);

  if (loading) {
    return (
      <div className="p-8 text-lg bg-black w-[100vw] h-[100vh] font-bold text-[32px] text-white flex items-center justify-center">
        Please Wait.....
      </div>
    )
  }

  return (
    <div>
      {authUser && <ApplicantDashboard />}
      {companyUser && <CompanyDashboard />}
    </div>
  );
};

export default Page;
