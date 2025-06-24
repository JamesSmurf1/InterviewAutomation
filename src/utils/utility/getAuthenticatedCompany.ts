
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Company from '../model/Company.model';
import { connectDb } from './ConnectDb';

export const getAuthenticatedCompany = async () => {
    await connectDb();

    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;
    if (!token) return { error: 'No company token found.' };

    try {
        const decoded = jwt.verify(token, process.env.NEXT_JWT_SECRET!) as { id: string };
        const company = await Company.findById(decoded.id).select('-password');
        if (!company) return { error: 'No company found.' };
        return company;
    } catch (err) {
        console.error('JWT Error:', err);
        return { error: 'Invalid company token' };
    }
};
