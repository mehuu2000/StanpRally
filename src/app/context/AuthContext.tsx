'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { QueryState } from '@tanstack/react-query';

export const AUTH_CACHE_KEY = ['auth', 'session'];  // useAuthSession で使用するキー
export const STAMPS_CACHE_KEY = ['stamps']; // useStamps で使用するキー

type DehydratedQuery = {
  queryKey: unknown[];
  queryHash: string;
  state: QueryState<unknown, Error>;
};

export const CACHE_STORAGE_KEY = 'stamp-rally-cache-v1';

export function logPersistedCache() {
  if (typeof window !== 'undefined') {
    const cache = window.sessionStorage.getItem(CACHE_STORAGE_KEY);
    console.log('[Cache] 永続化キャッシュ状態:', cache ? 'あり' : 'なし');
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        console.log('[Cache] キャッシュ内容:', parsed);
        if (parsed.queries) {
          console.log('[Cache] 保存されているクエリ:', Object.keys(parsed.queries));
        }
      } catch (e) {
        console.error('[Cache] キャッシュのパースエラー:', e);
      }
    }
  }
}

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
      // セッションストレージを使用した永続化
      const storagePersister = createSyncStoragePersister({
        storage: window.sessionStorage,
        key: CACHE_STORAGE_KEY,
      });
      setPersister(storagePersister);
      
      // 初期化時にキャッシュ状態をログ出力（デバッグ用）
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          logPersistedCache();
        }, 500);
      }
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

  // デバッグ用: キャッシュの状態をコンソールに出力
  const logQueryDehydration = (query: DehydratedQuery): boolean => {
    // 永続化するかどうかの判定
    const firstKey = Array.isArray(query.queryKey) && query.queryKey.length > 0
      ? query.queryKey[0]
      : null;
    
    // キャッシュ永続化の結果をログ出力
    const shouldCache = typeof firstKey === 'string' && (
      firstKey === 'auth' || firstKey === 'stamps'
    );
    
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Cache] キャッシュ永続化判定: ${shouldCache ? '保存する' : '保存しない'} - キー:`, 
        query.queryKey
      );
    }
    
    return shouldCache;
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24時間キャッシュ有効
        buster: 'v1', // キャッシュバージョン
        dehydrateOptions: {
          shouldDehydrateQuery: (query: DehydratedQuery) => {
            return logQueryDehydration(query);
          },
        },
        // 復元前/後のイベントリスナーを追加
        onSuccess: () => {
          console.log('[Cache] キャッシュを正常に復元しました');
          if (process.env.NODE_ENV === 'development') {
            setTimeout(logPersistedCache, 100);
          }
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