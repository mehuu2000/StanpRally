import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const dynamic = 'force-dynamic'

/*
*
* email: メールアドレス
* passWord: パスワード
* 
* これらをフロントから受け取る
*/

const loginValideate = z.object({
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
});

export async function POST(req: NextRequest) {
    const body = await req.json();

    const result = loginValideate.safeParse(body);
    if(!result.success) {
        return NextResponse.json({ message: 'バリデーションエラー ', error: result.error.errors}, {status: 400});
    }

    const { email, password } = result.data;

    // 既存のユーザーをチェック
    const existingUser = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!existingUser) {
        return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 400 });
    }

    // 既存ユーザーのハッシュパスワードと作ったパスワードを比較
    const isValidPassword = await bcrypt.compare(password, existingUser.hashedPassword);

    if(!isValidPassword) {
        return NextResponse.json({ message: 'パスワードが間違っています' }, { status: 400 });
    }
    

    console.log('ログインが成功しました');

    return NextResponse.json({ message: 'ログインが成功しました' }, { status: 201 });
}