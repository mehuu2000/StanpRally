import { emailService } from './email-service';

export async function sendWelcomeEmail(user: { email: string; name: string }): Promise<boolean> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>StampRallyへようこそ！</h2>
        <p>こんにちは、${user.name}さん。</p>
        <p>StampRallyへのご登録ありがとうございます！</p>
        <p>（${user.email}）<br>このメールアドレスで登録が完了しました。</p>
        <p>このアプリは、文化フェスティバル2025のために特別に開発されたスタンプラリーアプリです。<br>ぜひ楽しんでください</p>
        <p>何か質問やサポートが必要な場合は、以下のメールアドレスからお気軽にお問い合わせください。</p>
        <p>文化フェスティバル2025運営 <br><a href="mailto:bunfes@gmail.com">bunfes@gmail.com</a></p>
        <p>文化フェスティバル2025運営、StampRally開発チーム</p>
        <p>このメールは自動生成されたものです。返信しないでください。</p>
      </div>
    `;
    
    return await emailService.sendEmail({
      to: user.email,
      subject: 'StampRally - ご登録ありがとうございます',
      html,
    });
    
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return false;
  }
}