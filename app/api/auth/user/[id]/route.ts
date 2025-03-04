import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop(); // Берём последний сегмент пути
        console.log("Получен ID из URL:", id); // Проверяем, что id получен

        const users = await prisma.users.findMany({
            where: {
                id: parseInt(id as string)
            },
            include: { message: true }
        })
        return NextResponse.json({ users: users })
    } 
    catch (error) {
        console.error("Ошибка получения пользователя:", error);
        return NextResponse.json({ success: false, error: "Ошибка сервера." }, { status: 500 });
    }
}