import { emailService } from './email-service';

export async function sendWelcomeEmail(user: { email: string; name: string }): Promise<boolean> {
  const contactEmail = process.env.CONTACT_EMAIL || 'bunfes@gmail.com';

  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>文フェススタンプラリーアプリへようこそ!</h2>
        <p>こんにちは、${user.name}さん。</p>
        <p>文フェススタンプラリーアプリへのご登録ありがとうございます。</p>
        <p>このメールアドレス（${user.email}）で登録が完了しました。</p>
        <p>何か質問やサポートが必要な場合は、以下のメールアドレスからお気軽にお問い合わせください。</p>
        <p>お問い合わせ <a href="mailto:${contactEmail}" style="color: #007bff; text-decoration: underline;">${contactEmail}</a></p>
        <p>文化フェスティバル2025運営チーム</p>
        <p>自動送信です。このメールに返信しないでください。</p>
      </div>
    `;

    const text = `
文フェススタンプラリーアプリへようこそ!

こんにちは、${user.name}さん。

文フェススタンプラリーアプリへのご登録ありがとうございます。
このメールアドレス（${user.email}）で登録が完了しました。

何か質問やサポートが必要な場合は、お気軽にお問い合わせください。
お問い合わせ: ${contactEmail}

文化フェスティバル2025運営チーム
自動送信です。このメールに返信しないでください。
    `;
    
    return await emailService.sendEmail({
      to: user.email,
      subject: '文化フェス2025 スタンプラリー - アカウント登録完了',
      html,
      text,
    });
    
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return false;
  }
}