import { emailService } from './email-service';

export async function sendWelcomeEmail(user: { email: string; name: string }): Promise<boolean> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>StampRallyへようこそ！</h2>
        <p>こんにちは、${user.name}さん。</p>
        <p>文化祭スタンプラリーアプリへのご登録ありがとうございます。</p>
        <p>（${user.email}）<br>このメールアドレスで登録が完了しました。</p>
        <p>何か質問やサポートが必要な場合は、以下のメールアドレスからお気軽にお問い合わせください。</p>
        <p>お問い合わせ bunfes@gmail.com</p>
        <p>文化フェスティバル2025運営チーム</p>
      </div>
    `;

    const text = `
StampRallyへようこそ

こんにちは、${user.name}さん。

文化祭スタンプラリーアプリへのご登録ありがとうございます。
このメールアドレス（${user.email}）で登録が完了しました。

お問い合わせ: bunfes@gmail.com

文化フェスティバル運営チーム
    `;
    
    return await emailService.sendEmail({
      to: user.email,
      subject: 'StampRally - ご登録ありがとうございます',
      html,
      text,
    });
    
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return false;
  }
}