import { emailService } from './email-service';

export async function sendGiftEmail(user: { email: string; name: string, gift: string }): Promise<boolean> {
  const contactEmail = process.env.CONTACT_EMAIL || 'bunfes@gmail.com';
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>おめでとうございます！</h2>
        <p>こんにちは、${user.name}さん。</p>
        <p>文フェススタンプラリーの抽選の結果</p>
        <p>${user.gift} が当選しました！</p>
        <h3>景品の受け取りについて</h3>
        <p>受け取りはクロージングセレモニー(4/25 12:30~)閉会後に悠久の庭でお渡しします。<br>受け取りの際は、こちらのメールかアプリのアカウントがわかるものをお持ちください<br>(スクリーンショット等は場合によってお断りさせていただくことがあります。)</p>
        <p>その他、不明点などがありましたら、以下のメールアドレスからお気軽にお問い合わせください。</p>
        <p>お問い合わせ <a href="mailto:${contactEmail}" style="color: #007bff; text-decoration: underline;">${contactEmail}</a></p>
        <p>文化フェスティバル2025運営チーム</p>
        <p>自動送信です。このメールに返信しないでください。</p>
      </div>
    `;

    const text = `
おめでとうございます！

こんにちは、${user.name}さん。

文フェススタンプラリーの抽選の結果

${user.gift} が当選しました！

景品の受け取りについて

受け取りはクロージングセレモニー(4/25 12:30~)閉会後に悠久の庭でお渡しします。
受け取りの際は、こちらのメールかアプリのアカウントがわかるものをお持ちください
(スクリーンショット等は場合によってお断りさせていただくことがあります。)

その他、不明点などがありましたら、以下のメールアドレスからお気軽にお問い合わせください。
お問い合わせ: ${contactEmail}

文化フェスティバル2025運営チーム
自動送信です。このメールに返信しないでください。
    `;
    
    return await emailService.sendEmail({
      to: user.email,
      subject: 'スタンプラリー 抽選結果のお知らせ',
      html,
      text,
    });
    
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return false;
  }
}