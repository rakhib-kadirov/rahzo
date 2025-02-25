import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(request: Request) {
    try {
        // const { searchParams } = new URL(request.url)
        // if (!params?.params?.id) {
        //     return NextResponse.json({ success: false, error: "ID не передан" }, { status: 400 });
        // }

        const url = new URL(request.url);
        const id = url.pathname.split("/").pop(); // Берём последний сегмент пути
        console.log("Получен ID из URL:", id); // Проверяем, что id получен
        // console.log("SESSION:", session)
        // if (!session || !session.user) {
        //     return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 });
        // }
        // return NextResponse.json({ success: true, user: session?.user });
        const sql = "SELECT * FROM users WHERE id = ?"
        const [users] = await db.query(sql, [id])
        return NextResponse.json({ users: users })

    } catch (error) {
        console.error("Ошибка получения пользователя:", error);
        return NextResponse.json({ success: false, error: "Ошибка сервера." }, { status: 500 });
    }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const { id } = req.query;
//     const session = await auth()
//     console.log("🔍 ID из запроса:", id); // Логируем ID, который приходит

//     if (!id) {
//         return res.status(400).json({ error: "ID не передан" });
//     }

//     try {
//         const sql = "SELECT * FROM users WHERE id = ?"
//         const [user] = await db.query(sql, [session.user.id])
//         console.log("👤 Пользователь из базы:", user); // Логируем ответ

//         if (!user) {
//             return res.status(404).json({ error: "Пользователь не найден" });
//         }

//         return res.status(200).json(user);
//     } catch (error) {
//         console.error("❌ Ошибка API:", error);
//         return res.status(500).json({ error: "Ошибка сервера" });
//     }
// }