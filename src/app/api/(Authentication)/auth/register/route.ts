import { connectDb } from "@/utils/utility/ConnectDb"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'

import User from "@/utils/model/User.model"


export const POST = async (req: Request) => {

    const body = await req.json()
    const { username, password } = body

    try {
        await connectDb()

        const ifExist = await User.findOne({ username: username })
        if (ifExist) return NextResponse.json({ error: "user already exist." }, { status: 400 })
        if (password.length < 6) return NextResponse.json({ error: "password must be 6 characters" }, { status: 400 })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ username, password: hashPassword })
        await newUser.save()

        return NextResponse.json(newUser, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Interanl Server Error.' }, { status: 500 })
    }
}