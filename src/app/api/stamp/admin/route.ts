// app/api/stamp/admin/route.ts

import { NextResponse } from "next/server"
import client from "@/app/lib/prisma"
import { User, Stamps } from "@prisma/client"

//一時的に誰でも確認できるようになっている

export async function GET() {
    try {
        const users = await client.user.findMany({
            include: { stamps: true }
        })
    
        const data = users.map((user: User & { stamps: Stamps | null }) => ({
            userId: user.id,
            email: user.email,
            ...(user.stamps ?? {})
        }))
    
        return NextResponse.json({ data })
    } catch (err) {
        console.error("API Error in /api/stamp/admin:", err)
        return new Response("Internal Server Error", { status: 500 })
    }
}
