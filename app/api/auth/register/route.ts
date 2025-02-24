// import { registerUser } from "@/auth";
import { db } from "@/app/lib/db";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request: Request) {
    try {
        const { login, password, first_name, last_name } = await request.json()

        if (!login || !password || password.length < 6) {
            console.error("Ошибка: Некорректные данные для регистрации.")
            return NextResponse.json(
                { success: false, error: 'Некорректные данные для регистрации.' },
                { status: 400 }
            )
        }

        // User found
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE login = ?",
            [login]
        )
        if ((existingUser as any[]).length > 0) {
            console.error("Ошибка: Пользователь с таким логином уже существует.")
            return NextResponse.json(
                { success: false, error: "Пользователь с таким логином уже существует." },
                { status: 400 }
            )
        }

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await db.query(
            "INSERT INTO users (login, password, first_name, last_name) VALUES (?, ?, ?, ?)",
            [login, hashedPassword, first_name, last_name]
        )

        return NextResponse.json(
            { success: true, userId: (result as any).insertId },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Ошибка: Ошибка регистрации!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}