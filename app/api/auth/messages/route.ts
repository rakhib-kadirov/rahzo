import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    const session = auth()

    const url = new URL(req.url);
    const chatId = Number(url.searchParams.get("chatId"));

    try {
        const messages = await prisma.message.findMany({
            where: {
                users: {
                    first_name: session?.user?.first_name,
                    last_name: session?.user?.last_name,
                },
                // chatId: chatId
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                userId: true,
                text: true,
                createdAt: true,
                first_name: true,
                last_name: true,
                profile_photo: true,
            }
            // include: { users: true },
            // orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, messages }, {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Message Error' }, { status: 400 });
    }
}

export async function POST(req: NextRequest) {
    const { text, userId, first_name, last_name, users, chat } = await req.json()
    const dateNow = new Date(Date.now())
    const user = await prisma.users.findUnique({
        where: {
            id: userId,
        }
    })
    if (!user) {
        return NextResponse.json({ error: 'Пользователь не найден.' }, { status: 404 })
    }

    const message = await prisma.message.create({
        data: {
            text,
            userId,
            createdAt: dateNow,
            first_name,
            last_name,
            users,
            chat,
        }
    })
    return NextResponse.json(message)
}