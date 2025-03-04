import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const session = await auth()
        // const sql = `SELECT * FROM posts_user`
        // const sql = `
        //     SELECT posts_user.id_post, posts_user.body_text, posts_user.date, users.first_name, users.last_name, posts_user.users_id
        //     FROM posts_user
        //     JOIN users ON posts_user.users_id = users.id
        //     ORDER BY posts_user.date DESC
        //     `
        //     // WHERE users.first_name = ? AND users.last_name = ?
        // const [posts] = await db.query(sql)

        const posts = await prisma.posts_user.findMany({
            orderBy: {
                date: 'desc'
            },
            include: {
                users: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        profile_photo: true,
                    }
                }
            }
        })

        return NextResponse.json({ posts: posts, user: session.user })
    } catch (error: any) {
        console.error("Ошибка: Ошибка поиска постов! Пользователя", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}