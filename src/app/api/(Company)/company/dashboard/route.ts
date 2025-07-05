// /api/company/dashboard/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/utils/utility/ConnectDb";
import Job from "@/utils/model/company/Post-a-job.model";
import ApplicantAnswer from "@/utils/model/applicant/ApplicantAnswer.model";

export const GET = async () => {
  try {
    await connectDb();

    const jobs = await Job.find();
    const applicants = await ApplicantAnswer.find();

    const jobsWithApplicants = jobs.filter((j) => j.applicants.length > 0);
    const jobsNeedingQuestions = jobs.filter((j) => j.interviewQuestions.length === 0);
    const recentJobs = jobs.slice(-5).reverse();

    return NextResponse.json({
      totalJobs: jobs.length,
      totalApplicants: applicants.length,
      jobsWithApplicants: jobsWithApplicants.length,
      jobsNeedingQuestions: jobsNeedingQuestions.length,
      recentJobs,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
