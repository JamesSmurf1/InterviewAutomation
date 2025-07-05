import { NextResponse } from "next/server";
import Job from "@/utils/model/company/Post-a-job.model";
import { getAuthenticatedUser } from "@/utils/utility/getAuthenticatedUser";
import { connectDb } from "@/utils/utility/ConnectDb";


// export const POST = async (request: Request) => {
//   try {
//     const userAuth = await getAuthenticatedUser();
//     if (!userAuth || !userAuth._id) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const { JobId } = body;

//     const job = await Job.findById(JobId);

//     if (!job) {
//       return NextResponse.json({ message: 'Job not found' }, { status: 404 });
//     }

//     // Prevent duplicate applications
//     if (job.applicants.includes(userAuth._id)) {
//       return NextResponse.json({ message: 'You have already applied to this job' }, { status: 400 });
//     }

//     job.applicants.push(userAuth._id);
//     await job.save();

//     return NextResponse.json({ message: 'Successfully applied to job' });

//   } catch (error) {
//     console.error('Error applying to job:', error);
//     return NextResponse.json('Internal Server Error', { status: 500 });
//   }
// };


export const POST = async (request: Request) => {
  try {
    await connectDb();

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

    // ✅ Check if user has already applied using nested applicant object
    const alreadyApplied = job.applicants.some(
      (entry:any) => entry.applicant.toString() === userAuth._id.toString()
    );

    if (alreadyApplied) { 
      return NextResponse.json(
        { message: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // ✅ Push structured applicant object
    job.applicants.push({
      applicant: userAuth._id,
      status: 'pending',
      answers: [],
    });

    await job.save();

    return NextResponse.json({ message: 'Successfully applied to job' });

  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
};


export const DELETE = async (request: Request) => {
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

    if (!job.applicants.includes(userAuth._id)) {
      return NextResponse.json({ message: 'You have not applied to this job' }, { status: 400 });
    }

    job.applicants = job.applicants.filter(
      (applicantId: any) => applicantId.toString() !== userAuth._id.toString()
    );

    await job.save();

    return NextResponse.json({ message: 'Successfully unapplied from job' });

  } catch (error) {
    console.error('Error unapplying from job:', error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
};