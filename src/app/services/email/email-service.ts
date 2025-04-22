import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

export type EmailData = {
  to: string;       // 受信者のメールアドレス
  subject: string;  // メールの件名
  html: string;     // メールのHTMLコンテンツ
  text?: string;    // メールのテキストコンテンツ（オプション）
  from?: string;    // 送信者のメールアドレス
};

export class EmailService {
  private sender: string;
  private mailgun: any;
  private domain: string;

  constructor() {
    this.sender = process.env.EMAIL_FROM || '文フェススタンプラリー <postmaster@mail.bunfes.com>';
    this.domain = process.env.MAILGUN_DOMAIN || 'mail.bunfes.com';

    const mailgun = new Mailgun(FormData);
    this.mailgun = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY || '',
    });
    console.log('Mailgunサービス初期化完了 - ドメイン:', this.domain);
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const { to, subject, html, text, from = this.sender } = data;

      const recipients = Array.isArray(to) ? to : [to];
      
      const result = await this.mailgun.messages.create(this.domain, {
        from,
        to: recipients,
        subject,
        html,
        text: text || this.convertToPlainText(html), // HTMLからプレーンテキストに変換
      });

      console.log('メール送信成功:', result);
      return true;
    } catch (error) {
      console.error('メール送信失敗:', error);
      return false;
    }
  }
  private convertToPlainText(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n') // <br>タグを改行に変換
      .replace(/<\/p>/gi, '\n\n')    // </p>タグを段落区切りに変換
      .replace(/<[^>]*>?/gm, '')     // その他全てのHTMLタグを削除
      .replace(/&nbsp;/g, ' ')       // 特殊文字を置換
      .replace(/\n\s*\n/g, '\n\n')   // 連続した空行を1つにまとめる
      .trim();                       // 前後の空白を削除
  }
}

// シングルトンインスタンスをエクスポート
export const emailService = new EmailService();