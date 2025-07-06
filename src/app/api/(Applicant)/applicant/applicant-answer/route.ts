import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/utility/ConnectDb';

import Job from '@/utils/model/company/Post-a-job.model';
import InterviewQuestion from '@/utils/model/company/Question.model';

export const POST = async (req: Request) => {
    try {
        await connectDb();

        const body = await req.json();
        const { answers, jobId, applicantId } = body;

        console.log('📥 Incoming data:', { answers, jobId, applicantId });

        // Step 1: Find the job by its ID
        const selectedJob = await Job.findById(jobId);
        console.log('This is the job:', selectedJob);

        if (
            !answers ||
            !Array.isArray(answers) ||
            !jobId ||
            !applicantId
        ) {
            console.log('❌ Validation failed');
            return NextResponse.json(
                { message: 'Missing or invalid data' },
                { status: 400 }
            );
        }

        // Step 2: Find interview questions for this job
        const interview = await InterviewQuestion.findOne({ job: jobId });
        if (!interview) {
            return NextResponse.json(
                { message: 'Interview questions not found for this job.' },
                { status: 404 }
            );
        }

        // Step 3: Find the applicant within the job's applicants array
        const applicantIndex = selectedJob.applicants.findIndex(
            (applicant: any) => applicant.applicant.toString() === applicantId
        );

        if (applicantIndex === -1) {
            return NextResponse.json(
                { message: 'Applicant not found for this job.' },
                { status: 404 }
            );
        }

        // Step 4: Update the applicant's answers
        selectedJob.applicants[applicantIndex].answers = answers;

        // Step 5: Save the updated job document
        await selectedJob.save();

        console.log('✅ Updated job with new answers:', selectedJob);

        return NextResponse.json(
            { message: 'Answers updated successfully', job: selectedJob },
            { status: 200 }
        );
    } catch (err) {
        console.error('❌ Error during saving answers:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};


