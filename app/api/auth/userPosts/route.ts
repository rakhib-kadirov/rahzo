import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const session = await auth()
        const { id_post, body_text } = await request.json()
        const dateNow = new Date(Date.now())
        const messages = await prisma.posts_user.create({
            data: {
                id_post: id_post,
                users_id: parseInt(session?.user.id),
                first_name: session?.user.first_name,
                last_name: session?.user.last_name,
                body_text: body_text,
                date: dateNow,
            },
            select: {
                id_post: true,
                users_id: true,
                first_name: true,
                last_name: true,
                body_text: true,
                date: true,
            }
        })

        return NextResponse.json(
            { success: true, postId: (messages as any).insertId },
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

export async function GET() {
    try {
        // const url = new URL(request.url);
        // const id = url.pathname.split("/").pop()

        const session = await auth()
        // const sql = `
        //     SELECT posts_user.id_post, posts_user.body_text, posts_user.date, posts_user.users_id, users.id, users.first_name, users.last_name, users.profile_photo
        //     FROM posts_user
        //     JOIN users ON posts_user.users_id = users.id
        //     WHERE posts_user.users_id = ?
        //     ORDER BY posts_user.date DESC
        // `
        // const [posts] = await db.query(sql, [session.user.id])

        const posts = await prisma.posts_user.findMany({
            where: {
                users_id: parseInt(session.user.id)
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
        console.error("Ошибка: Ошибка поиска постов! Общие", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}