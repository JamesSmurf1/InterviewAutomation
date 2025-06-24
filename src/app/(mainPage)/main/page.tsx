'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/zustand/useAuthStore';
import useCompanyStore from '@/zustand/useCompanyStore';

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
    const fetchUsers = async () => {
      const user = await getLoggedInUser();
      const company = await getLoggedInCompany();

      // Redirect if neither is logged in
      if (!user && !company) {
        router.push('/');
      } else {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getLoggedInUser, getLoggedInCompany, router]);

  const handleLogout = async () => {
    if (authUser) {
      await logoutFunction();
    } else if (companyUser) {
      await logoutCompany();
    }
    router.push('/');
  };

  if (loading) {
    return <div className="p-8 text-lg">Loading...</div>;
  }

  return (
    <div className="p-8 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>

      {authUser ? (
        <div className="space-y-4">
          <p className="text-lg">
            👤 Logged in as <strong>Applicant</strong>: {authUser.username || authUser.name}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : companyUser ? (
        <div className="space-y-4">
          <p className="text-lg">
            🏢 Logged in as <strong>Company</strong>: {companyUser.companyName}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
