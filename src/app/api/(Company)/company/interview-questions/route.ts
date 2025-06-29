
import { NextRequest, NextResponse } from 'next/server';
import Job from '@/utils/model/company/Post-a-job.model';
import { connectDb } from '@/utils/utility/ConnectDb';
import { generateSmartQuestions } from '@/utils/ai/generateQuestions';

export const POST = async (req: NextRequest) => {
    try {
        await connectDb();
        const { jobId } = await req.json();

        const job = await Job.findById(jobId);
        if (!job || !job.requirements) {
            return NextResponse.json({ error: 'Job not found or lacks requirements' }, { status: 400 });
        }

        const questions = await generateSmartQuestions(job.requirements);

        return NextResponse.json({
            message: 'Questions generated successfully',
            questions
        });
    } catch (error) {
        console.error('❌ Error generating interview questions:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
};
