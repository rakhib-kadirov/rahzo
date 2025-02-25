'use server'

// import createConnection from "@/app/lib/db";
import { db } from "@/app/lib/db";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

// export async function POST() {
//     try {
//         const db = await createConnection()
//         // const sql = "INSERT INTO users (first_name, last_name) VALUES (?, ?);"
//         const sql = "SELECT login, password FROM users"
//         const [users] = await db.query(sql)
//         return NextResponse.json({users: users})
//     } catch (error) {
//         return NextResponse.json({error: error})
//     }
// }

const SECRET = process.env.JWT_SECRET || 'null'

export async function POST(request: Request) {
    try {
        const { login, password } = await request.json();
        const [user] = await db.query("SELECT * FROM users WHERE login = ?", [login]);
        // console.log("Login: ", login)

        if ((user as any[]).length === 0) {
            return NextResponse.json({ success: false, error: "Неверный логин или пароль LOGIN" }, { status: 401 });
        }

        const passwordsMatch = await bcrypt.compare(password, (user as any)[0].password);
        if (!passwordsMatch) {
            return NextResponse.json({ success: false, error: "Неверный логин или пароль PASSWORD" }, { status: 401 });
        }

        // Token
        const token = jwt.sign(
            {
                id: (user as any)[0].id,
                login: (user as any)[0].login,
                first_name: (user as any)[0].first_name,
                last_name: (user as any)[0].last_name,
            },
            SECRET!,
            { expiresIn: '7d' }
        ) as any
        // Cookie
        const cookie = serialize('session', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        })
        const response = NextResponse.json({success: true, user})
        response.cookies.set('authjs.session-token', cookie, { httpOnly: true, secure: true })

        // return NextResponse.json(JSON.stringify({ login: login, success: true, redirect: "/dashboard" }), {
        //     status: 200,
        //     headers: { 'Set-Cookie': cookie }
        // });
        // return NextResponse.json({ success: true, token, redirect: "/dashboard" });
        return response
    }
    catch (error: any) {
        console.error("Ошибка авторизации!", error.message)

        return NextResponse.json(
            {
                success: true,
                error: 'Ошибка сервера.'
            },
            { status: 500 }
        )
    }
}