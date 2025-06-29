'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useApplicantStore from '@/zustand/useApplicantStore';
import useCompanyStore from '@/zustand/useCompanyStore';

const Page = () => {
  const router = useRouter();

  const {
    authUser,
    getLoggedInUser,
  } = useApplicantStore();

  const {
    companyUser,
    getLoggedInCompany,
  } = useCompanyStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndValidate = async () => {
      const company = await getLoggedInCompany();
      const user = await getLoggedInUser();

      if (!user && !company) {
        router.replace('/');
      } else if (company) {
        router.replace('/main/company');
      } else if (user) {
        router.replace('/main/applicant');
      } else {
        router.replace('/');
      }
    };

    fetchAndValidate();
  }, [getLoggedInUser, getLoggedInCompany, router]);

  if (loading) {
    return (
      <div className="p-8 text-lg bg-black w-[100vw] h-[100vh] font-bold text-[32px] text-white flex items-center justify-center">
        Please wait...
      </div>
    );
  }

  return null; // no UI needed here because of redirection
};

export default Page;
