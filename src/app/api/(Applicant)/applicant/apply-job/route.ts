import { NextResponse } from "next/server";
import Job from "@/utils/model/company/Post-a-job.model";
import { getAuthenticatedUser } from "@/utils/utility/getAuthenticatedUser";

export const POST = async (request: Request) => {
  try {
    const userAuth = await getAuthenticatedUser();
    if (!userAuth || !userAuth._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { JobId } = body;

    const job = await Job.findById(JobId);

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Prevent duplicate applications
    if (job.applicants.includes(userAuth._id)) {
      return NextResponse.json({ message: 'You have already applied to this job' }, { status: 400 });
    }

    job.applicants.push(userAuth._id);
    await job.save();

    return NextResponse.json({ message: 'Successfully applied to job' });

  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
};
