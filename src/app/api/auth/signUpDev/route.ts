import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/app/services/email/notification';

export const dynamic = 'force-dynamic'

/*
* 
* name: 名前
* email: メールアドレス
* passWord: パスワード
* 
* これらをフロントから受け取る
*/

const signupValideate = z.object({
    name: z.string().min(2, '名前は2文字以上である必要があります'),
    email: z.string()
        .email('有効なメールアドレスを入力してください')
        .refine(
            email => {
            // RFC 5322に準拠したより厳密な正規表現
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(email);
            },
            { message: 'メールアドレスの形式が正しくありません' }
        ),
    password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
});

const HASHCOUNT = 10;

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = signupValideate.safeParse(body);
    if(!result.success) {
        return NextResponse.json({ message: 'バリデーションエラー ', error: result.error.errors}, {status: 400});
    }

    const { name, email, password } = result.data;

    // 既存のユーザーをチェック
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
        return NextResponse.json({ message: 'この名前もしくはメールアドレスは既に使用されています' }, { status: 400 });
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, HASHCOUNT);

    // 新しいユーザーを作成
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
            stamps: {
                create: {
                    updatedAt: new Date(),
                }
            }
        },
    });

    console.log('ユーザー登録が成功しました', user);
    try {
        // TypeScriptエラーを解消するために明示的な型チェック
        await sendWelcomeEmail({
            email: email,
            name: name
        });
        console.log(`確認メールを ${email} に送信しました`);
    } catch (error) {
        console.error('確認メール送信中にエラーが発生しました:', error);
    }

    return NextResponse.json({ message: 'ユーザー登録が成功しました', user }, { status: 201 });
}