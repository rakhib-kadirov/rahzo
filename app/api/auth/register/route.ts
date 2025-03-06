// import { registerUser } from "@/auth";
// import { db } from "@/app/lib/db";
// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import bcrypt from "@node-rs/bcrypt"
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const session = await auth()
    try {
        const { login, password, first_name, last_name }: { login: string, password: string, first_name: string, last_name: string } = await request.json()

        if (!login || !password || password.length < 6) {
            console.error("Ошибка: Некорректные данные для регистрации.")
            return NextResponse.json(
                { success: false, error: 'Некорректные данные для регистрации.' },
                { status: 400 }
            )
        }

        // User found
        const existingUser = prisma.users.findUnique({
            where: {
                id: parseInt(session?.user.id as string),
                login: login
            }
        })
        if ((existingUser as any).length > 0) {
            console.error("Ошибка: Пользователь с таким логином уже существует.")
            return NextResponse.json(
                { success: false, error: "Пользователь с таким логином уже существует." },
                { status: 400 }
            )
        }

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await prisma.users.create({
            data: {
                // id: parseInt(id),
                login: login,
                password: hashedPassword,
                first_name: first_name,
                last_name: last_name,
            },
            select: {
                // id: true,
                login: true,
                password: true,
                first_name: true,
                last_name: true,
            }
        })

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