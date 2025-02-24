import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();  // ⬅ Принудительно вызываем session()

    console.log("DEBUG API - Session:", session); // ✅ Логируем сессию

    return NextResponse.json(session);
}
