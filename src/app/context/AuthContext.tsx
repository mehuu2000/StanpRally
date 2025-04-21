'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { QueryState } from '@tanstack/react-query';

type DehydratedQuery = {
  queryKey: unknown[];
  queryHash: string;
  state: QueryState<unknown, Error>;
};

export const CACHE_STORAGE_KEY = 'stamp-rally-cache-v1';

export function clearPersistedCache() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(CACHE_STORAGE_KEY);
    console.log('[Cache] 永続化キャッシュがクリアされました');
    return true;
  }
  return false;
}

export default function AuthContext({ children }: { children: React.ReactNode }) {
  // React Queryクライアントの作成
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000, // 30分間はデータを新鮮と見なす
        gcTime: 60 * 60 * 1000, // 1時間キャッシュを保持
        refetchOnWindowFocus: false, // ウィンドウがフォーカスされたときに再取得しない
        retry: 1, // エラー時の再試行回数
      },
    },
  }));

  // ブラウザ環境でのみ永続化を設定
  const [persister, setPersister] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPersister(
        createSyncStoragePersister({
          storage: window.sessionStorage,
          key: CACHE_STORAGE_KEY,
        })
      );
    }
  }, []);

  // SSR時やブラウザ初期化前は永続化なしのプロバイダーを使用
  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
        </SessionProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24時間キャッシュ有効
        buster: 'v1', // キャッシュバージョン（変更するとキャッシュリセット）
        dehydrateOptions: {
          shouldDehydrateQuery: (query: DehydratedQuery) => {
            // 永続化するキャッシュを制限（セキュリティとパフォーマンスのため）
            const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : query.queryKey;
            return (
              queryKey === 'auth' || 
              queryKey === 'session' ||
              queryKey === 'stamps'
            );
          },
        },
      }}
    >
      <SessionProvider>
        {children}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </SessionProvider>
    </PersistQueryClientProvider>
  );
}