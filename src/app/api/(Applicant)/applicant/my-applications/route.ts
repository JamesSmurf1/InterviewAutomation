import { NextResponse } from "next/server";
import Job from "@/utils/model/company/Post-a-job.model";
import { getAuthenticatedUser } from "@/utils/utility/getAuthenticatedUser";
import { connectDb } from "@/utils/utility/ConnectDb";
import "@/utils/model/Company.model";

export const GET = async () => {
    try {
        await connectDb();

        const userAuth = await getAuthenticatedUser();
        if (!userAuth || !userAuth._id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const myAppliedJobs = await Job.find({
            "applicants.applicant": userAuth._id
        }).populate("posterId", "companyName");

        return NextResponse.json(myAppliedJobs);
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
};
