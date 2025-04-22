import { NextResponse } from "next/server"
import client from "@/app/lib/prisma"
import { User, Stamps } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/nextAuth"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        
        if (!session || !session.user?.publicId) {
            return new Response("Unauthorized", { status: 401 })
        }
        const email = session.user.email
        if(email!="xppn772p8xdwt9iq@gmail.com"){
            return NextResponse.json({message: "You are Not Allowed User", status: 400 })
        }
        const users = await client.user.findMany({
            include: { stamps: true }
        })

        if(users.length === 0){
        return NextResponse.json({ message: "No users found", data: [] })
        }
        const data = users.map((user: User & { stamps: Stamps | null }) => ({
            userId: user.publicId,
            email: user.email,
            ...(user.stamps ?? {})
        }))
    
        return NextResponse.json({ data ,status:200})
    } catch (err) {
        // console.error(err)
        return Response.json({message: "Internal Server Error" ,error:"Internal Server Error", status: 500 })
    }
}
