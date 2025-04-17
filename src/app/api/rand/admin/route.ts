// app/api/stamp/admin/route.ts

import { NextResponse } from "next/server"
import client from "@/app/lib/prisma"
// import { User, Stamps } from "@prisma/client"

//一時的に誰でも確認できるようになっている
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // const users = await client.user.findMany({
        //     include: { stamps: true }
        // })
        //とりあえず、スタンプ五つコンプリートしている人のみ選択。
        const users = await client.stamps.findMany({
            where: {
              stamp1: true,
              stamp2: true,
              stamp3: true,
              stamp4: true,
              stamp5: true,
            },
            include: { user: true }
          })

        if(users.length === 0){
        return NextResponse.json({ message: "No users found", data: [] })
        }
        const data = users.map((entry) => ({
            userId: entry.user.id,
            email: entry.user.email,
          }))
        return NextResponse.json({ data ,status:200})
    } catch (err) {
        console.error(err)
        return Response.json({message: "Internal Server Error", status: 500 })
    }
}
