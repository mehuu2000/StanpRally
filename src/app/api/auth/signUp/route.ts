import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';

/*
*
* email: メールアドレス
* passWord: パスワード
* 
* これらをフロントから受け取る
*/
export async function POST(req: NextRequest) {
    const {email, password} = await req.json();

    const HASHCOUNT = 10;

    if (!email || !password) {
        return NextResponse.json({ message: '必要な情報が不足しています' }, { status: 400 });
    }

    // 既存のユーザーをチェック
    const existingUser = await prisma.user.findFirst({
        where: {
            email,
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
            email,
            hashedPassword,
        },
    });

    console.log('ユーザー登録が成功しました', user);

    return NextResponse.json({ message: 'ユーザー登録が成功しました', user }, { status: 201 });
}