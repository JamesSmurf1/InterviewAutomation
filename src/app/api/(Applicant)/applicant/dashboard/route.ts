// /api/applicant/dashboard/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/utils/utility/ConnectDb";
import { getAuthenticatedUser } from "@/utils/utility/getAuthenticatedUser";
import Job from "@/utils/model/company/Post-a-job.model";

export const GET = async (req: Request) => {
    await connectDb();

    try {
        const userAuth = await getAuthenticatedUser();
        if (!userAuth || !userAuth._id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Get all jobs where this user is an applicant
        const appliedJobs = await Job.find({
            applicants: {
                $elemMatch: { applicant: userAuth._id },
            },
        });

        console.log(appliedJobs)

        return NextResponse.json({
            totalApplications: appliedJobs.length,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
};
