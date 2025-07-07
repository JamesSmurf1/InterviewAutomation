import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/utility/ConnectDb';

import Job from '@/utils/model/company/Post-a-job.model';



export const POST = async (req: Request) => {
    try {
        await connectDb();

        const body = await req.json();
        const { answers, jobId, applicantId } = body;

        if (!answers || !jobId || !applicantId || !Array.isArray(answers)) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }

     
        const jobSelected = await Job.findById(jobId);
        if (!jobSelected) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }

        const applicant = jobSelected.applicants.find(
            (a: any) => a.applicant.toString() === applicantId
        );

        if (!applicant) {
            return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
        }


        applicant.answers = answers;


        await jobSelected.save();

        console.log(jobSelected)

        return NextResponse.json({
            message: 'Answers submitted successfully',
            updatedApplicant: applicant,
        });
    } catch (err) {
        console.error('❌ Error during saving answers:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
