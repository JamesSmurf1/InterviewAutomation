import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/utility/ConnectDb';
import Job from '@/utils/model/company/Post-a-job.model';
import { getAuthenticatedCompany } from '@/utils/utility/getAuthenticatedCompany';


export const POST = async (request: Request) => {

    await connectDb()

    const companyAuth = await getAuthenticatedCompany();
    if (!companyAuth || !companyAuth._id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const {
            title,
            position,
            type,
            location,
            salary,
            description,
            requirements,
        } = body;

        // Basic validation
        if (!title || !position || !location || !description) {
            return NextResponse.json(
                { message: 'Required fields missing' },
                { status: 400 }
            );
        }


        const newJob = await Job.create({
            posterId: companyAuth._id,
            title,
            position,
            type,
            location,
            salary,
            description,
            requirements,
        });

        return NextResponse.json(newJob, { status: 201 });
    } catch (error) {
        return NextResponse.json('Internal server Error', { status: 500 });
    }
};
