// app/api/stamp/route.ts

import { NextResponse } from "next/server"
import client from "@/app/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/nextAuth"
import { z } from "zod"

const R = 6371e3 // 地球半径（メートル）

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
const startDate = new Date('2025-04-23T09:00:00+09:00');
const endDate = new Date('2025-04-24T18:00:00+09:00'); 
// スタンプ地点情報（仮データ）
const stampPoints: Record<number, { lat: number, lng: number, password: string|undefined,availableAt: Date, expiredAt: Date,}> = {
    1: { lat: 34.77499379168766, lng: 135.51212397901585 , password: process.env.QR_Password1, expiredAt: startDate, availableAt: endDate},
    2: { lat: 34.77435822763561, lng: 135.51176280359462, password: process.env.QR_Password2, expiredAt: startDate, availableAt: endDate},
    3: { lat: 34.774364081650134, lng: 135.51110844565466 , password: process.env.QR_Password3, expiredAt: startDate, availableAt: endDate},
    4: { lat: 34.77482176055961, lng: 135.51125279706034 , password: process.env.QR_Password4, expiredAt: startDate, availableAt: endDate},
    5: { lat: 34.77435822763561, lng: 135.51176280359462, password: process.env.QR_Password5, expiredAt: startDate, availableAt: endDate}
}

//フロントから取得する情報　lat,lng,stampId,password ※lat,lngは0でもよい

export async function GET() {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.publicId) {
        return NextResponse.json({ message: "Unauthorized", status: 401 })
    }
    const publicId = session.user.publicId

    const user = await client.user.findUnique({
        where: { publicId },
        include: { stamps: true }
    })
    if(!user) {
        return NextResponse.json({ message: "User not found", status: 400 })
    }
    if (!user.stamps) {
        // スタンプレコードがない場合は作成
        await client.stamps.create({ data: { userId: user.id } })
    }
    return NextResponse.json({ data: user, status: 200 })
}

export async function POST(req: Request) {
    try {
        const stampSchema = z.object({
            lat: z.number().optional(),
            lng: z.number().optional(),
            stampId: z.number(),
            password: z.string(),
            // frontPublicId: z.string()
        })

        const body = stampSchema.parse(await req.json())
        // const { lat, lng, stampId, password, frontPublicId } = body
        const { lat, lng, stampId, password } = body

        const session = await getServerSession(authOptions)
        
        if (!session || !session.user?.publicId) {
            return NextResponse.json({ message: "Unauthorized", status: 401 })
        }
        const publicId = session.user.publicId
        // if(publicId!=frontPublicId){
        //     return NextResponse.json({ message: "Unauthorized", status: 401 })
        // }
        //有効な時間かチェック
        const now = new Date();
        if(now <= startDate || now >= endDate){
            return NextResponse.json({ message: "Out of time", status: 400 })
        }
        // 有効なstampIdかチェック
        if (![1, 2, 3, 4, 5].includes(stampId)) {
            return NextResponse.json({ message: "Invalid stampId", status: 400 })
        }
        if(stampPoints[stampId].password != password){
            return NextResponse.json({ message: "Missing password", status: 400 })
        }
        // ユーザーとStampsを取得
        const user = await client.user.findUnique({
            where: { publicId },
            include: { stamps: true }
        })

        if (!user) return NextResponse.json({ message: "User not found", status: 400 })
        if (!user.stamps) {
            // スタンプレコードがない場合は作成
            await client.stamps.create({ data: { userId: user.id } })
        }

        const stamps = await client.stamps.findUnique({ where: { userId: user.id } })
        if (!stamps) return NextResponse.json({ message: "Stamps record missing", status: 500 })

        const stampField = `stamp${stampId}` as keyof typeof stamps
        const innerField = `inner${stampId}`

        if (stamps[stampField]) {
            return NextResponse.json({ message: "Stamp already collected", status: 200 })
        }

        const point = stampPoints[stampId]
        if (!point) return NextResponse.json({ message: "Stamp point not found", status: 400 })

        const updateData: Record<string, boolean | number> = {
            [stampField]: true,
            count: stamps.count + 1
        }

        if (typeof lat === "number" && typeof lng === "number") {
            const distance = getDistance(lat, lng, point.lat, point.lng)
            //500は仮置き
            if (distance <= 500) {
                updateData[innerField] = true
            } else {
                updateData[innerField] = false
            }

            await client.stamps.update({
                where: { userId: user.id },
                data: updateData
            })

            return NextResponse.json({ message: "Stamp collected", distance, inner: updateData[innerField], status: 200 })
        } else {
        // 位置情報なしでもスタンプだけは押せる（innerはfalse）
        updateData[innerField] = false
        await client.stamps.update({
            where: { userId: user.id },
            data: updateData
        })

        return NextResponse.json({ message: "Stamp collected", inner: false, status: 200 })
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                {
                message: "Validation error",
                // errors: err.errors
                },
                { status: 400 }
            )
        }
        // その他のエラー
        return NextResponse.json({ message: "Unexpected server error" },{ status: 500 })
    }
}
