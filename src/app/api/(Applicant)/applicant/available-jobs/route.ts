import { NextResponse } from "next/server";
import Job from "@/utils/model/company/Post-a-job.model";
import { getAuthenticatedUser } from "@/utils/utility/getAuthenticatedUser";
import { connectDb } from "@/utils/utility/ConnectDb";
import "@/utils/model/Company.model";

export const GET = async () => {
  await connectDb();

  try {
    const userAuth = await getAuthenticatedUser();
    if (!userAuth || !userAuth._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Only return jobs where the user is NOT in the applicants list
    const availableJobs = await Job.find({
      "applicants.applicant": { $ne: userAuth._id },
    }).populate("posterId", "companyName");

    return NextResponse.json(availableJobs);
  } catch (error) {
    console.error("Error fetching available jobs:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
