import { connectDb } from "@/utils/utility/ConnectDb"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'

import Company from "@/utils/model/Company.model"


export const POST = async (req: Request) => {

    const body = await req.json()
    const { companyName, password } = body

    try {
        await connectDb()

        const ifExist = await Company.findOne({ companyName: companyName })
        if (ifExist) return NextResponse.json({ error: "Company already exist." }, { status: 400 })
        if (password.length < 6) return NextResponse.json({ error: "password must be 6 characters" }, { status: 400 })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newCompany = new Company({ companyName, password: hashPassword })
        await newCompany.save()

        return NextResponse.json(newCompany, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Interanl Server Error.' }, { status: 500 })
    }
}