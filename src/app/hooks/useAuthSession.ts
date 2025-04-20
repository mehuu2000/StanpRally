'use client';

import { getSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

// 固有のキャッシュキー
const SESSION_CACHE_KEY = ['auth', 'session'];

export function useAuthSession() {
  const queryClient = useQueryClient();
  const [hasMounted, setHasMounted] = useState(false);

  // クライアントサイドのマウント検出
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // デバッグ用セッション取得ラッパー
  const fetchSession = async () => {
    console.log('[Auth] Fetching session from API:', new Date().toISOString());
    try {
      const session = await getSession();
      console.log('[Auth] Session fetch complete:', !!session);
      return session;
    } catch (error) {
      console.error('[Auth] Session fetch error:', error);
      throw error;
    }
  };

  // React Query でのセッション取得
  const {
    data: session,
    isLoading,
    status,
    error,
  } = useQuery({
    queryKey: SESSION_CACHE_KEY,
    queryFn: fetchSession,
    staleTime: Infinity, // 手動で無効化するまでキャッシュを使用
    gcTime: 24 * 60 * 60 * 1000, // 24時間キャッシュ保持
    refetchOnWindowFocus: false,
    refetchOnMount: false,    // マウント時の再フェッチを防止
    refetchOnReconnect: false, // 再接続時の再フェッチを防止
    retry: false, // エラー時の再試行なし
    enabled: hasMounted, // クライアントサイドでのみ実行
  });

  const sessionStatus: SessionStatus = !session
    ? isLoading
      ? 'loading'
      : 'unauthenticated'
    : 'authenticated';

  // 初回マウント時のキャッシュ初期化
  useEffect(() => {
    if (hasMounted) {
      const cachedSession = queryClient.getQueryData(SESSION_CACHE_KEY);
      
      if (cachedSession === undefined) {
        // 初回マウント時でキャッシュがない場合のみフェッチ
        console.log('[Auth] Initial session fetch');
        queryClient.fetchQuery({
          queryKey: SESSION_CACHE_KEY,
          queryFn: fetchSession,
        });
      } else {
        console.log('[Auth] Using cached session');
      }
    }
  }, [hasMounted, queryClient]);

  // セッションの明示的更新メソッド
  const refresh = async () => {
    console.log('[Auth] Manually refreshing session');
    return queryClient.fetchQuery({
      queryKey: SESSION_CACHE_KEY,
      queryFn: fetchSession,
    });
  };

  // セッションクリアメソッド(ログアウト用)
  const clear = () => {
    console.log('[Auth] Clearing session cache');
    queryClient.removeQueries({ queryKey: SESSION_CACHE_KEY });
  };

  if (error) {
    console.error('[Auth] Session query error:', error);
  }

  return {
    data: session,
    status: sessionStatus,
    isLoading,
    refresh,
    clear,
  };
}