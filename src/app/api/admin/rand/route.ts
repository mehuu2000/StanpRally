import { NextResponse } from "next/server"
import client from "@/app/lib/prisma"
// import { error } from "console"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
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

        if (users.length === 0) {
            return NextResponse.json({ message: "No users found", data: [] })
        }

        const gifts: string[] = [
            "万博チケット",
            "スタバカード",
            "スタバカード",
            "スタバカード",
            "スタバカード",
            "スタバカード",
            "関大グッズ",
            "関大グッズ",
            "関大グッズ",
            "関大グッズ",
            "関大グッズ",
        ]

        // inner の true 数によって倍率を決定
        const weightedList = users.flatMap(user => {
            const trueCount = [user.inner1, user.inner2, user.inner3, user.inner4, user.inner5]
                .filter(Boolean).length

            // 倍率を計算（例：0→1, 1→1.25, 2→1.5, ...）
            const weight = 1 + trueCount * 0.1

            // weight に応じて user を複製
            return Array(Math.round(weight)).fill(user)
        })

        // ユーザーをシャッフル
        const shuffledUsers = [...weightedList].sort(() => 0.5 - Math.random())
        const selectedWinners: typeof users = []
        for (const user of shuffledUsers) {
            if (selectedWinners.find(w => w.user.id === user.user.id)) {
                continue // すでに当選してるならスキップ
            }
            selectedWinners.push(user)
            if (selectedWinners.length === gifts.length) break
        }

        // ギフトもシャッフル
        const shuffledGifts = [...gifts].sort(() => 0.5 - Math.random())

        const result = selectedWinners.map((entry, index) => ({
            name: entry.user.name,
            userId: entry.user.id,
            email: entry.user.email,
            gift: shuffledGifts[index],
            innerTrueCount: [entry.inner1, entry.inner2, entry.inner3, entry.inner4, entry.inner5]
                .filter(Boolean).length
        }))

        return NextResponse.json({ data: result, status: 200 })
    } catch (err) {
        console.error(err)
        return Response.json({ message: "Internal Server Error", error: "Internal Server Error", status: 500 })
    }
}