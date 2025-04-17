import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

/*
* 
* name: 名前
* email: メールアドレス
* passWord: パスワード
* 
* これらをフロントから受け取る
*/

const signupValideate = z.object({
    name: z.string().min(3, '名前は2文字以上である必要があります'),
    email: z.string()
        .email('有効なメールアドレスを入力してください')
        .refine(
            email => {
            // RFC 5322に準拠したより厳密な正規表現
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(email);
            },
            { message: 'メールアドレスの形式が正しくありません' }
        ),
    password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
    visitorId: z.string(),
    cookieUUID: z.string().optional(),
    newCookieUUID: z.string().optional(),
});

const HASHCOUNT = 10;

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = signupValideate.safeParse(body);
    if(!result.success) {
        return NextResponse.json({ message: 'バリデーションエラー ', error: result.error.errors}, {status: 400});
    }

    const { name, email, password, visitorId, cookieUUID, newCookieUUID } = result.data;

    // emailとnameで既存のユーザーをチェック
    const existingUser = await prisma.user.findFirst({
        where: 
            {
                OR: [
                    { email },
                    { name },
                ],
        },
    });
    if (existingUser) {
        return NextResponse.json({ message: 'この名前もしくはメールアドレスは既に使用されています' }, { status: 409 });
    }

    // cookieUUID が既に登録済みかを確認
    if (cookieUUID) {
        const existingCookie = await prisma.cookieUUID.findUnique({ 
            where: { cookieUUID } 
        });
        if (existingCookie) {
            return NextResponse.json({ message: 'この端末ではすでにアカウントが作成されています' }, { status: 403 });
        }
    }

    // トランザクションを使用して、ユーザーと CookieUUID を同時に登録
    try {
        const createdUser = await prisma.$transaction(async (tx) => {
            let canRegister = false;
            let deviceControlId: number | null = null;

            // visitorId を確認
            const deviceControl = await tx.deviceControl.findUnique({
                where: { visitorId },
                include: { cookies: true },
            });
            if (!deviceControl) {
                // visitorId 未登録
                canRegister = true;
                const newDevice = await tx.deviceControl.create({
                    data: { visitorId },
                });
                deviceControlId = newDevice.id;
            } else {
                // visitorId 登録済み
                if (deviceControl.counter < 3) {
                    canRegister = true;
                    deviceControlId = deviceControl.id;
                } else {
                    return NextResponse.json({ message: 'このデバイスではこれ以上アカウントを作成できません' }, { status: 403 });
                }
            }

            if (!canRegister || (!cookieUUID && !newCookieUUID)) {
                return NextResponse.json({ message: '登録条件を満たしていません' }, { status: 403 });
            }

            // パスワードをハッシュ化
            const hashedPassword = await bcrypt.hash(password, HASHCOUNT);

            // 新しいユーザーを作成
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    hashedPassword,
                },
            });

            // CookieUUID 登録
            if (newCookieUUID && deviceControlId) {
                await tx.cookieUUID.create({
                    data: {
                        cookieUUID: newCookieUUID,
                        deviceControlId,
                    },
                });
                // counter を増やす
                await tx.deviceControl.update({
                    where: { id: deviceControlId },
                    data: { counter: { increment: 1 } },
                });
            }
            return user;
        });

        console.log('ユーザー登録が成功しました', createdUser);

        return NextResponse.json({ message: 'ユーザー登録が成功しました', user: createdUser }, { status: 201 });

    } catch (error) {
        console.error('登録中にエラーが発生しました:', error);
        return NextResponse.json({ message: 'ユーザー登録中にエラーが発生しました' }, { status: 500 });
    }
}