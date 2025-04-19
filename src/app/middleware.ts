import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// キャッシュ設定
export const runtime = 'edge';

// 重要なルートのみチェックするよう最適化
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 静的アセット、API、画像はスキップ
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // 公開パス
  const publicPaths = ['/'];
  const authPath = '/auth';
  
  // 認証が必要なルートかどうか確認する簡略化
  const requiresAuth = !publicPaths.includes(pathname) && pathname !== authPath;
  
  // 認証不要のルートはトークン検証をスキップ
  if (!requiresAuth) {
    // authパスのみ特別処理（認証済みならダッシュボードへ）
    if (pathname === authPath) {
      try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (token) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (e) {
        // トークン検証エラーは無視して次へ
      }
    }
    return NextResponse.next();
  }
  
  // 認証が必要なパスのみトークン検証
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      const url = new URL(authPath, request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  } catch (e) {
    // エラー発生時は認証ページへ
    return NextResponse.redirect(new URL(authPath, request.url));
  }
  
  return NextResponse.next();
}

// 最小限のマッチャー
export const config = {
  matcher: [
    // 重要なパスのみ明示的に指定
    '/dashboard',
    '/dashboard/:path*',
    '/stamps',
    '/stamps/:path*',
    '/qr',
    '/qr/:path*',
    '/scan',
    '/auth',
    '/',
  ]
};