import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const session = await auth()
        const { body_text } = await request.json()
        const dateNow = new Date(Date.now())
        const [result] = await db.query(
            "INSERT INTO posts_user (users_id, body_text, date) VALUES (?, ?, ?)",
            [session.user.id, body_text, dateNow]
        )

        return NextResponse.json(
            { success: true, postId: (result as any).insertId },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Ошибка: Ошибка публикации поста!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const parts = url.pathname.split("/")
        const userIndex = parts.indexOf("user");
        const id = userIndex !== -1 && parts[userIndex + 1] ? parts[userIndex + 1] : null;

        // const sql = `
        //     SELECT posts_user.id_post, posts_user.body_text, posts_user.date, posts_user.users_id, users.id, users.first_name, users.last_name, users.profile_photo
        //     FROM posts_user
        //     JOIN users ON posts_user.users_id = users.id
        //     WHERE posts_user.users_id = ?
        //     ORDER BY posts_user.date DESC
        // `
        const posts = await prisma.posts_user.findMany({
            where: {
                users_id: parseInt(id as string)
            },
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

        return NextResponse.json({ posts: posts })
    } catch (error: any) {
        console.error("Ошибка: Ошибка поиска постов!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}