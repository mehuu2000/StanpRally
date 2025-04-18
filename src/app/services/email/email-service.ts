import { Resend } from 'resend';

// 環境変数からAPIキーを取得
const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailData = {
  to: string;       // 受信者のメールアドレス
  subject: string;  // メールの件名
  html: string;     // メールのHTMLコンテンツ
  text?: string;    // メールのテキストコンテンツ（オプション）
  from?: string;    // 送信者のメールアドレス
};

export class EmailService {
  private sender: string;

  constructor() {
    this.sender = process.env.EMAIL_FROM || '文化祭スタンプラリー <noreply@resend.dev>';
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      const { to, subject, html, text, from = this.sender } = data;
      
      const result = await resend.emails.send({
        from,
        to,
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