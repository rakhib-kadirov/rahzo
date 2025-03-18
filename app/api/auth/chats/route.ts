import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { user1Id } = await req.json(); // users - массив пользователей для группового чата
    const session = auth()


    // Найти чат между пользователями
    let chat = await prisma.chat.findFirst({
        where: {
            participants: {
                some: {
                    userId: Number(session.user.id),
                },
            },
        },
        include: { message: true }
    });

    // Если чата нет, создать его
    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                participants: {
                    create: [
                        { userId: parseInt(user1Id) },
                        { userId: parseInt(session.user.id) },
                    ],
                },
            },
            include: { message: true }
        });
        return NextResponse.json({ chat });
    } else {
        return NextResponse.json({ error: 'Invalid chat type or insufficient users for group chat' }, { status: 400 });
    }




    // if (type === 'private') {
    //     const chat = await prisma.chat.create({
    //         data: {
    //             type: 'private',
    //             users: {
    //                 create: [
    //                     { user: { connect: { id: user1Id } } },
    //                     { user: { connect: { id: user2Id } } },
    //                 ],
    //             },
    //         },
    //     });
    //     return NextResponse.json({ chat });
    // } else if (type === 'group' && users.length > 1) {
    //     const chat = await prisma.chat.create({
    //         data: {
    //             type: 'group',
    //             users: {
    //                 create: users.map((userId: number) => ({
    //                     user: { connect: { id: userId } },
    //                 })),
    //             },
    //         },
    //     });
    //     return NextResponse.json({ chat });
    // } else {
    //     return NextResponse.json({ error: 'Invalid chat type or insufficient users for group chat' }, { status: 400 });
    // }
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const session = await auth()
    const otherUserId = Number(url.searchParams.get("otherUserId"));
    const currentUserId = Number(url.searchParams.get("currentUserId"));
    console.log('USER_ID: ', otherUserId, ' ', currentUserId)

    // Проверяем входные данные
    if (!currentUserId || !otherUserId || currentUserId === otherUserId) {
        console.log("Ошибка: некорректные userId");
        return NextResponse.json({ error: "Некорректные userId" }, { status: 400 });
    }

    try {
        // 1️ Ищем существующий чат между пользователями
        let chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: currentUserId } } },
                    { participants: { some: { userId: otherUserId } } },
                ],
            },
            include: {
                message: true,
                participants: { include: { user: { include: { message: true } } } }
            },
        });
        console.log('CHAT: ', chat)

        // 2️ Если чата нет, создаем новый
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    participants: {
                        create: [
                            { user: { connect: { id: currentUserId } } },
                            { user: { connect: { id: otherUserId } } },
                        ],
                    },
                },
                include: {
                    message: true,
                    participants: { include: { user: { include: { message: true } } } }
                },
            });
        }
        console.log("Используем chatId:", chat.id);

        return NextResponse.json({ chat: [chat] });
    } catch (error) {
        console.error("Ошибка при создании чата:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}