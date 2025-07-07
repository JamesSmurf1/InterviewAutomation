import Job from "@/utils/model/company/Post-a-job.model";
import { connectDb } from "@/utils/utility/ConnectDb";
import { NextResponse } from "next/server";
import "@/utils/model/Applicant.model";
import "@/utils/model/company/Post-a-job.model";
import mongoose from "mongoose";

export const POST = async (req: Request) => {
    try {
        await connectDb();
        const body = await req.json();
        const { status, applicantId, listingId } = body;

        // console.log('Status:', status);
        // console.log('Applicant ID:', applicantId);
        // console.log('Listing ID:', listingId);

        // Convert to ObjectId
        const jobObjectId = new mongoose.Types.ObjectId(listingId);
        const applicantObjectId = new mongoose.Types.ObjectId(applicantId);

        // console.log(jobObjectId)

        // Get the job document
        const job = await Job.findOne({ _id: listingId });
        if (!job) {
            console.log('job not found')
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        // Find the applicant inside job.applicants
        const applicant = job.applicants.find((a: any) =>
            a.applicant.toString() === applicantObjectId.toString()
        );

        if (!applicant) {
            console.log('applicant not found')
            return NextResponse.json({ message: "Applicant not found" }, { status: 404 });
        }

        // Update status
        applicant.status = status;

        // Save changes
        await job.save();

        return NextResponse.json({ message: "Applicant status updated", updatedApplicant: applicant });
    } catch (err) {
        console.error("Error updating applicant status:", err);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
};