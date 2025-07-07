import { NextRequest, NextResponse } from 'next/server';
import Job from '@/utils/model/company/Post-a-job.model';
import { connectDb } from '@/utils/utility/ConnectDb';
import { generateSmartQuestions } from '@/utils/ai/generateQuestions';

export const GET = async (req: NextRequest) => {
  try {
    await connectDb();

    const jobId = req.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ questions: job.interviewQuestions || [] });
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

    job.interviewQuestions.push(...questions);

    await job.save();

    return NextResponse.json({
      message: 'Questions generated and saved successfully',
      questions,
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

    const job = await Job.findById(jobId);

    if (!job || !job.interviewQuestions?.length) {
      return NextResponse.json({ error: 'No interview questions found' }, { status: 404 });
    }

    job.interviewQuestions = [];
    await job.save();

    return NextResponse.json({ message: 'Interview questions deleted' });
  } catch (error) {
    console.error('❌ Delete Interview Questions Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
};
