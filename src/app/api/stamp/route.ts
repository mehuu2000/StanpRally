// app/api/stamp/route.ts

import { NextResponse } from "next/server"
import client from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/nextAuth"

const R = 6371e3 // 地球半径（メートル）

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// スタンプ地点情報（仮データ）
const stampPoints: Record<number, { lat: number, lng: number }> = {
    1: { lat: 34.822444, lng: 135.522843 },
    2: { lat: 34.822900, lng: 135.523000 },
    3: { lat: 34.823100, lng: 135.522500 },
    4: { lat: 34.823300, lng: 135.522200 },
    5: { lat: 34.823500, lng: 135.521900 }
}

//フロントから取得する情報　lat,lng,stampId lat,lngはからでもよい

export async function POST(req: Request) {
    try {
        const { lat, lng, stampId } = await req.json()
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.publicId) {
            return new Response("Unauthorized", { status: 401 })
        }
        const publicId = session.user.publicId

        // 有効なstampIdかチェック
        if (![1, 2, 3, 4, 5].includes(stampId)) {
            return new Response("Invalid stampId", { status: 400 })
        }

        // ユーザーとStampsを取得
        const user = await client.user.findUnique({
            where: { publicId },
            include: { stamps: true }
        })

        if (!user) return new Response("User not found", { status: 404 })
        if (!user.stamps) {
            // スタンプレコードがない場合は作成
            await client.stamps.create({ data: { userId: user.id } })
        }

        const stamps = await client.stamps.findUnique({ where: { userId: user.id } })
        if (!stamps) return new Response("Stamps record missing", { status: 500 })

        const stampField = `stamp${stampId}` as keyof typeof stamps
        const innerField = `inner${stampId}`

        if (stamps[stampField]) {
            return new Response("Stamp already collected", { status: 200 })
        }

        const point = stampPoints[stampId]
        if (!point) return new Response("Stamp point not found", { status: 404 })

        const updateData: Record<string, boolean> = {
            [stampField]: true,
        }

        if (typeof lat === "number" && typeof lng === "number") {
            const distance = getDistance(lat, lng, point.lat, point.lng)
            //100は仮置き
            if (distance <= 100) {
                updateData[innerField] = true
            } else {
                updateData[innerField] = false
            }

            await client.stamps.update({
                where: { userId: user.id },
                data: updateData
            })

            return NextResponse.json({ message: "Stamp collected", distance, inner: updateData[innerField] })
        } else {
        // 位置情報なしでもスタンプだけは押せる（innerはfalse）
        updateData[innerField] = false
        await client.stamps.update({
            where: { userId: user.id },
            data: updateData
        })

        return NextResponse.json({ message: "Stamp collected (no location)", inner: false })
        }
    } catch (err) {
        return Response.json({ message: "Unauthorized", status: 401 })
    }
}
