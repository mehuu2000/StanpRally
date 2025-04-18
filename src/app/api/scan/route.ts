import { NextResponse } from 'next/server';
import { spotPasswords, SpotKey } from '../../lib/spot-passwords';  // 依存関係のインポート

// GET メソッドを処理
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const spot = url.searchParams.get('spot');
    const userId = url.searchParams.get('userId');
    const password = url.searchParams.get('password');

    // 必要なパラメータが揃っているかチェック
    if (!spot || !userId || !password) {
      return NextResponse.json({ message: 'パラメータが不足しています' }, { status: 400 });
    }

    // パスワードの比較
    const spotKey = spot as SpotKey;
    const validPassword = spotPasswords[spotKey];

    // パスワードが一致するか確認
    if (validPassword !== password) {
      return NextResponse.json({ message: 'パスワードが間違っています' }, { status: 400 });
    }

    // パスワードが正しい場合の処理
    // 例えば、スポットのデータベース更新やその他の処理を行う

    // 成功した場合、成功レスポンスを返す
    // return NextResponse.json({ message: 'パスワードが正しいです', success: true });
    //urlは後程変更
    const baseUrl = process.env.NEXTAUTH_URL;
    const stampApiUrl = `${baseUrl}`;
    const stampResponse = await fetch(stampApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            spot,
            frontPublicId: userId,
            success: true,
        }),
    });

    // /api/stamp からのレスポンスを確認
    if (!stampResponse.ok) {
        return NextResponse.json({ message: 'スタンプの更新に失敗しました' }, { status: 500 });
    }
    return NextResponse.json({ message: 'スタンプの更新に成功', success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '内部サーバーエラーが発生しました' }, { status: 500 });
  }
}
