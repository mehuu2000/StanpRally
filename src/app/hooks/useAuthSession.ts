'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function useAuthSession() {
  // 既存のNext-Auth useSessionフック
  const { data: sessionData, status: nextAuthStatus, update } = useSession();
  
  // React Queryでセッションデータをキャッシュ
  const { data: session, isLoading: queryLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => Promise.resolve(sessionData),
    enabled: nextAuthStatus !== 'loading',
    staleTime: 30 * 60 * 1000, // 3分間は新鮮なデータとして扱う（AuthContextと合わせる）
    gcTime: 60 * 60 * 1000, // 5分間キャッシュを保持（AuthContextと合わせる）
    initialData: sessionData, // 初期データとして既存のセッションデータを使用
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再取得しない（AuthContextと合わせる）
  });

  const status: SessionStatus = nextAuthStatus as SessionStatus;
  const isLoading = status === 'loading' || queryLoading;

  // useSessionと同じAPIを維持しつつ、キャッシュを活用
  return { 
    data: session, 
    status, 
    isLoading,
    update
  };
}