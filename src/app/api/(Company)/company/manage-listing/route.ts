import { NextResponse } from "next/server";
import Job from "@/utils/model/company/Post-a-job.model";
import { connectDb } from "@/utils/utility/ConnectDb";
import { getAuthenticatedCompany } from '@/utils/utility/getAuthenticatedCompany';

export const GET = async () => {
    await connectDb();

    const companyAuth = await getAuthenticatedCompany();
    if (!companyAuth || !companyAuth._id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const getMyListing = await Job.find({ posterId: companyAuth._id })

        return NextResponse.json(getMyListing);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json('Internal server Error', { status: 500 });
    }
};

export const PATCH = async (req: Request) => {
    await connectDb();

    const companyAuth = await getAuthenticatedCompany();
    if (!companyAuth || !companyAuth._id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { jobId, updates } = await req.json();

    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId, posterId: companyAuth._id },
            { $set: updates },
            { new: true }
        );

        if (!updatedJob) {
            return NextResponse.json({ message: "Job not found or unauthorized." }, { status: 404 });
        }

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
};

export const DELETE = async (req: Request) => {
    await connectDb();

    const companyAuth = await getAuthenticatedCompany();
    if (!companyAuth || !companyAuth._id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
        return NextResponse.json({ message: "Job ID missing" }, { status: 400 });
    }

    try {
        const deleted = await Job.findOneAndDelete({
            _id: jobId,
            posterId: companyAuth._id,
        });

        if (!deleted) {
            return NextResponse.json({ message: "Job not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
};