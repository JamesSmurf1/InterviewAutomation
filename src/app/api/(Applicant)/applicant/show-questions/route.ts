// /app/api/interview-questions/route.ts (or /pages/api/interview-questions.ts if using pages)
import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/utility/ConnectDb';
import InterviewQuestion from '@/utils/model/company/Question.model';

export const POST = async (req: Request) => {
    const body = await req.json()

    const { jobId } = body

    if (!jobId) {
        return NextResponse.json({ message: 'Missing jobId' }, { status: 400 });
    }

    try {
        await connectDb();
        const interview = await InterviewQuestion.findOne({ job: jobId });

        if (!interview) {
            return NextResponse.json({ message: 'No interview found' }, { status: 404 });
        }

        return NextResponse.json({ questions: interview.questions });
    } catch (err) {
        console.error('GET interview questions error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
};
