import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/utility/ConnectDb';

import ApplicantAnswer from '@/utils/model/applicant/ApplicantAnswer.model';
import InterviewQuestion from '@/utils/model/company/Question.model';

export const POST = async (req: Request) => {
    try {
        await connectDb();

        const body = await req.json();
        const { answers, jobId, applicantId } = body;

        console.log('📥 Incoming data:', { answers, jobId, applicantId });

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

        const interview = await InterviewQuestion.findOne({ job: jobId });

        console.log('🧠 Found Interview Document:', interview);

        if (!interview) {
            return NextResponse.json(
                { message: 'Interview questions not found for this job.' },
                { status: 404 }
            );
        }

        const savedAnswer = await ApplicantAnswer.create({
            applicant: applicantId,
            job: jobId,
            interviewQuestion: interview._id,
            answers,
        });

        console.log('✅ Answer saved:', savedAnswer);

        return NextResponse.json(
            { message: 'Answers saved successfully', savedAnswer },
            { status: 200 }
        );
    } catch (err) {
        console.error('❌ Error during save:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};
