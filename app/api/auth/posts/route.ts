import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await auth()
        // const sql = `SELECT * FROM posts_user`
        const sql = `
            SELECT posts_user.id_post, posts_user.body_text, posts_user.date, users.first_name, users.last_name, posts_user.users_id
            FROM posts_user
            JOIN users ON posts_user.users_id = users.id
            ORDER BY posts_user.date DESC
            `
            // WHERE users.first_name = ? AND users.last_name = ?
        const [posts] = await db.query(sql)

        return NextResponse.json({ posts: posts, user: session.user })
    } catch (error: any) {
        console.error("Ошибка: Ошибка поиска постов!", error.message)

        return NextResponse.json(
            { success: true, error: 'Ошибка сервера.' },
            { status: 500 }
        )
    }
}