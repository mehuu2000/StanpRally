import { getServerSession } from "next-auth";
import { authOptions } from "../lib/nextAuth";
import prisma from "@/app/lib/prisma";

export const dynamic = 'force-dynamic'

// ログインユーザー取得
const getCurrentUser = async () => {
    'use server';
    try {
        // セッション情報取得
        const session = await getServerSession(authOptions);
        
        // ログインしていない場合
        if (!session?.user?.publicId) {
            return null;
        }

        // ログインユーザー取得
        const response = await prisma.user.findUnique({
            where: {
                publicId: session.user.publicId,
            }
        });

        if (!response) {
            return null;
        }

        return response;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
};

export default getCurrentUser;