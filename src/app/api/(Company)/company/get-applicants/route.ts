
// /api/company/get-applicants/route.ts
import Job from "@/utils/model/company/Post-a-job.model";
import { connectDb } from "@/utils/utility/ConnectDb";
import { NextResponse } from "next/server";
import "@/utils/model/Applicant.model"; // Ensure it's registered
import "@/utils/model/company/Question.model";
import "@/utils/model/company/Post-a-job.model";

export const POST = async (req: Request) => {
  try {
    await connectDb();
    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ message: "Missing listingId" }, { status: 400 });
    }

    const job = await Job.findById(listingId)
      .populate("applicants.applicant", "username") // ✅ populate actual user details
      .populate("interviewQuestions");

      console.log(job)

    // console.log(JSON.stringify(job, null, 2)); // 👈 full output

    return NextResponse.json({ applicants: job?.applicants || [] }, { status: 200 });
  } catch (err) {
    console.error("Error fetching applicants:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
