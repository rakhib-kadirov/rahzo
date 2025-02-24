import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            include: { message: true }
        })
        // const sql = "SELECT * FROM users"
        // const [users] = await db.query(sql)
        return NextResponse.json({ users })
    } catch (error) {
        return NextResponse.json({ error: error })
    }
}