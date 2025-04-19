'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
// import { Loader } from './ui/Loader'; // ローディングコンポーネント（必要に応じて作成）

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthPath = pathname === '/auth';
  const isPublicPath = pathname === '/';
  
  useEffect(() => {
    // まだ認証状態を確認中の場合は何もしない
    if (status === 'loading') return;
    
    // 認証済みユーザーがログインページにアクセスした場合
    if (isAuthPath && session) {
      router.replace('/dashboard');
      return;
    }
    
    // 未認証ユーザーが保護ページにアクセスした場合
    if (!isAuthPath && !isPublicPath && !session) {
      router.replace(`/auth?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [session, status, pathname, router, isAuthPath, isPublicPath]);
  
  // 認証状態確認中はローディング表示
  if (status === 'loading' && !isPublicPath) {
    return (
        <Box className="flex justify-center items-center min-h-screen">
            <CircularProgress sx={{ color: '#f97316' }} />
            <Typography className="ml-3 text-orange-600">読み込み中...</Typography>
        </Box>
    );
  }
  
  // 認証条件を満たしていればコンテンツを表示
  return <>{children}</>;
}