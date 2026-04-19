import { NextRequest, NextResponse } from 'next/server';
import { sendGiftEmail } from '@/app/services/email/giftMail';

export async function POST(req: NextRequest) {
  try {
    const users = await req.json();
    
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ 
        status: 400,
        message: '有効なユーザーデータがありません' 
      });
    }
    
    console.log(`${users.length}人のユーザーにメール送信を開始します`);
    
    // 送信処理を追跡する配列
    const results = [];
    let successCount = 0;
    
    // 各ユーザーにメールを送信
    for (const user of users) {
      try {
        // 必須パラメータの検証
        if (!user.email || !user.name || !user.gift) {
          results.push({
            name: user.name || 'unknown',
            email: user.email || 'unknown',
            success: false,
            error: '必須パラメータがありません',
            gift: user.gift || 'unknown'
          });
          continue;
        }
        
        // メール送信
        const success = await sendGiftEmail(user);
        
        results.push({
          name: user.name,
          email: user.email,
          success,
          error: success ? 'メール送信に成功しました' : 'メール送信に失敗しました',
          gift: user.gift || 'unknown'
        });
        
        if (success) successCount++;
        
        // 連続送信による制限回避のため、短い待機時間を設ける
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error) {
        results.push({
          name: user.name || 'unknown',
          email: user.email || 'unknown',
          success: false,
          error: String(error),
          gift: user.gift || 'unknown'
        });
      }
    }
    
    return NextResponse.json({
      status: 200,
      message: `${successCount}/${users.length} 件のメールを送信しました`,
      results
    });
    
  } catch (error) {
    console.error('抽選結果メール送信エラー:', error);
    return NextResponse.json({ 
      status: 500, 
      message: 'メール送信処理中にエラーが発生しました',
      error: String(error)
    });
  }
}