'use client';

import React, { useEffect } from 'react';
import Button from '@/components/reusable/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useApplicantStore from '@/zustand/useApplicantStore';
import useCompanyStore from '@/zustand/useCompanyStore';

export default function Home() {
  const router = useRouter();
  const { authUser, getLoggedInUser } = useApplicantStore();
  const { companyUser, getLoggedInCompany } = useCompanyStore();

  useEffect(() => {
    const checkSession = async () => {
      const user = await getLoggedInUser();
      const company = await getLoggedInCompany();

      if (user || company) {
        router.replace('/main');
      }
    };

    checkSession();
  }, [getLoggedInUser, getLoggedInCompany, router]);

  return (
    <div className="w-[100vw] h-[100vh] bg-black">
      <div className="w-full h-full flex items-center justify-center font-bold flex-col">
        <div className="text-[52px] font-bold text-transparent bg-clip-text custom-gradient">
          Interview Automation For Everyone
        </div>

        <div className="text-[42px] text-white">
          Search-View
        </div>
        <div className="text-white">Automate Interview Process For Everyone.</div>

        <div className="pt-[50px] flex gap-[25px]">
          <Link href="/applicant">
            <Button text="Continue as Applicant" />
          </Link>
          <Link href="/company">
            <Button text="Continue as Company" />
          </Link>
        </div>
      </div>
    </div>
  );
}
