import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/utility/ConnectDb';
import Job from '@/utils/model/company/Post-a-job.model';

export const POST = async (req: Request) => {
    const body = await req.json()

    const { jobId } = body

    if (!jobId) {
        return NextResponse.json({ message: 'Missing jobId' }, { status: 400 });
    }

    try {
        await connectDb();
        const JobQuestions = await Job.findOne({ _id: jobId });

        if (!JobQuestions) {
            return NextResponse.json({ message: 'No interview found' }, { status: 404 });
        }

        return NextResponse.json({ questions: JobQuestions.interviewQuestions });
    } catch (err) {
        console.error('GET interview questions error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
};
