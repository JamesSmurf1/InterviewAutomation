// /api/company/view-answers/route.ts

import Job from "@/utils/model/company/Post-a-job.model";

import { connectDb } from "@/utils/utility/ConnectDb";
import { NextResponse } from "next/server";
import "@/utils/model/Applicant.model";
import "@/utils/model/company/Post-a-job.model";

export const POST = async (req: Request) => {
    try {
        await connectDb();
        const body = await req.json();
        const { listingId } = body;

        if (!listingId) {
            return NextResponse.json({ message: "Missing listingId" }, { status: 400 });
        }

        const jobListing = await Job.findOne({ _id: listingId })

        console.log( jobListing.interviewQuestions)

        return NextResponse.json(jobListing.interviewQuestions);
    } catch (err) {
        console.error("Error fetching applicants:", err);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
};
