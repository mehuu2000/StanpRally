'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function AuthContext({ children }: { children: React.ReactNode }) {
  // React Queryクライアントの作成
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 180 * 1000, // 3分間はデータを新鮮と見なす
        gcTime: 5 * 60 * 1000, // 5分間キャッシュを保持
        refetchOnWindowFocus: false, // ウィンドウがフォーカスされたときに再取得しない
        retry: 1, // エラー時の再試行回数
      },
    },
  }));

  return (
    // QueryClientProviderを外側に配置
    <QueryClientProvider client={queryClient}>
      {/* 既存のSessionProviderを維持 */}
      <SessionProvider>
        {children}
      </SessionProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}