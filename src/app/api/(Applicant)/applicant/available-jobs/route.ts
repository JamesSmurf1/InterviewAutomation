import { NextResponse } from "next/server";
import Job from "@/utils/model/company/Post-a-job.model";
import { connectDb } from "@/utils/utility/ConnectDb";
import "@/utils/model/Company.model"

export const GET = async () => {
    await connectDb();
    try {
        const getAllJobs = await Job.find({}).populate('posterId', 'companyName');

        return NextResponse.json(getAllJobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json('Internal server Error', { status: 500 });
    }
};
