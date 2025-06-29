import { NextRequest, NextResponse } from 'next/server';
import Job from '@/utils/model/company/Post-a-job.model';
import InterviewQuestion from '@/utils/model/company/Question.model';
import { connectDb } from '@/utils/utility/ConnectDb';
import { generateSmartQuestions } from '@/utils/ai/generateQuestions';

export const GET = async (req: NextRequest) => {
  try {
    await connectDb();

    const jobId = req.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    // Find job and populate interview questions
    const job = await Job.findById(jobId).populate('interviewQuestions');

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!job.interviewQuestions || job.interviewQuestions.length === 0) {
      return NextResponse.json({ questions: [] });
    }

    // Flatten the questions from all interviewQuestion docs into one array
    const allQuestions = job.interviewQuestions.reduce(
      (acc: string[], iq: { questions: string[] }) => acc.concat(iq.questions),
      []
    );

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error('❌ Error fetching interview questions:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
    try {
        await connectDb();
        const { jobId } = await req.json();

        const job = await Job.findById(jobId);
        if (!job || !job.requirements) {
            return NextResponse.json({ error: 'Job not found or lacks requirements' }, { status: 400 });
        }

        const questions = await generateSmartQuestions(job.requirements);

        const savedQuestions = await InterviewQuestion.create({
            job: jobId,
            questions,
        });

        // ✅ Push question ID to job and save
        job.interviewQuestions.push(savedQuestions._id);
        await job.save();

        return NextResponse.json({
            message: 'Questions generated and saved successfully',
            questions: savedQuestions.questions,
        });
    } catch (error) {
        console.error('❌ Error generating interview questions:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connectDb();
    const jobId = req.nextUrl.searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const job = await Job.findById(jobId).populate('interviewQuestions');

    if (!job || !job.interviewQuestions?.length) {
      return NextResponse.json({ error: 'No interview questions found' }, { status: 404 });
    }

    // Delete the question documents
    await InterviewQuestion.deleteMany({ _id: { $in: job.interviewQuestions } });

    // Remove refs from Job
    job.interviewQuestions = [];
    await job.save();

    return NextResponse.json({ message: 'Interview questions deleted' });
  } catch (error) {
    console.error('❌ Delete Interview Questions Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
};
