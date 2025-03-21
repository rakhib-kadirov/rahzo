import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
    try {
        let chats = await prisma.chatParticipants.findMany({
            include: {
                // participants: { include: { user: { include: { message: true } } } },
                // message: true,
                user: true,
                chat: { include: { message: true, participants: { include: { user: true } } } },
            }
        });
        console.log('CHATS_PART: ', chats)

        return NextResponse.json({ chats: [chats] });
    } catch (error) {
        console.error("Ошибка при получении чатов:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}