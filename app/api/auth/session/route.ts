import { auth } from "@/auth";
import { NextResponse } from "next/server";

// export const { GET, POST } = auth;

export async function GET() {
    try {
        const session = await auth()

        // console.log("SESSION:", session)

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 });
        }

        return NextResponse.json({ success: true, user: session?.user });

    } catch (error) {
        console.error("Ошибка получения пользователя:", error);
        return NextResponse.json({ success: false, error: "Ошибка сервера." }, { status: 500 });
    }
}