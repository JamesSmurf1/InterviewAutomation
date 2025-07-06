// /api/company/view-answers/route.ts
import ApplicantAnswer from "@/utils/model/applicant/ApplicantAnswer.model";
import { connectDb } from "@/utils/utility/ConnectDb";
import { NextResponse } from "next/server";
import "@/utils/model/Applicant.model";
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

        const applicants = await ApplicantAnswer.find({ job: listingId }) // ✅ CORRECT filter
            .populate("applicant", "username")
            .populate("interviewQuestion", "questions");

        
        // console.log(applicants)

        return NextResponse.json({ applicants }, { status: 200 });
    } catch (err) {
        console.error("Error fetching applicants:", err);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
};
