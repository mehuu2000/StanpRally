import { Resend } from 'resend';

// 環境変数からAPIキーを取得
const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailData = {
  to: string;       // 受信者のメールアドレス
  subject: string;  // メールの件名
  html: string;     // メールのHTMLコンテンツ
  from?: string;    // 送信者のメールアドレス
};

export class EmailService {
  private sender: string;

  constructor() {
    this.sender = process.env.EMAIL_FROM || 'no-reply@stamprally.app';
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const { to, subject, html, from = this.sender } = data;
      
      const result = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      console.log('メール送信成功:', result);
      return true;
    } catch (error) {
      console.error('メール送信失敗:', error);
      return false;
    }
  }
}

// シングルトンインスタンスをエクスポート
export const emailService = new EmailService();