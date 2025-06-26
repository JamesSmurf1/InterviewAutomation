import { connectDb } from "@/utils/utility/ConnectDb"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from "@/utils/model/User.model"

const generateToken = ({ id }: { id: string }) => {
    const token = jwt.sign(
        { id: id },
        process.env.NEXT_JWT_SECRET!,
        { expiresIn: '7d' }
    )

    return token
}

export const POST = async (req: Request) => {

    const body = await req.json()
    const { username, password } = body

    try {
        await connectDb()

        const ifExist = await User.findOne({ username: username })
        if (!ifExist) return NextResponse.json({ error: "user doesnt exist." }, { status: 400 })

        const samePassword = await bcrypt.compare(password, ifExist.password)

        if (!samePassword) return NextResponse.json({ error: "password does not matched." }, { status: 400 })

        const token = generateToken({ id: ifExist._id })

        const response = NextResponse.json(ifExist)

        response.cookies.set('jwt', token, {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 14
        })

        return response

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Interanl Server Error.' }, { status: 500 })
    }
}