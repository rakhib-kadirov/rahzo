import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // 1️ Ищем существующий чат между пользователями
        let chat = await prisma.chat.findMany({
            include: { participants: { include: { user: { include: { message: true } } } } }
        });
        console.log('CHATS_PART: ', chat)

        return NextResponse.json({ chat: [chat] });
    } catch (error) {
        console.error("Ошибка при получении чатов:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}