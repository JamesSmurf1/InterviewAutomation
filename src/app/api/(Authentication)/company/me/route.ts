import { NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/utils/utility/getAuthenticatedCompany";

export const GET = async () => {
    const company = await getAuthenticatedCompany()
    if (company?.error) return NextResponse.json('Company is not authenticated or invalid token.', { status: 400 })

    return NextResponse.json(company)
}