'use client';

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stamps } from "@prisma/client";
import { STAMPS_CACHE_KEY } from '../context/AuthContext';
import { useEffect } from 'react';

interface StampsResponse {
  data: {
    stamps: Stamps;
  };
}

// APIからスタンプデータを取得する関数
const fetchStamps = async (): Promise<StampsResponse> => {
  console.log('[Stamps] Fetching stamps data at:', new Date().toISOString());
  
  const res = await fetch('/api/stamp', {
    method: 'GET',
    credentials: 'include', // セッションCookieを含める
    cache: 'no-store', // 常に最新データを取得
  });
  
  if (!res.ok) {
    console.error('[Stamps] API error:', res.status, res.statusText);
    throw new Error(`Failed to fetch stamps: ${res.status}`);
  }
  
  const data = await res.json();
  console.log('[Stamps] Fetched stamps:', data.data.stamps ? 'データあり' : 'データなし');
  
  return data;
};

// スタンプデータを取得・キャッシュするカスタムフック
export function useStamps() {
  const queryClient = useQueryClient();
  
  const query = useQuery<StampsResponse, Error>({
    queryKey: STAMPS_CACHE_KEY,
    queryFn: fetchStamps,
    staleTime: 30 * 60 * 1000, // 30分間キャッシュ
    gcTime: 60 * 60 * 1000,    // 60分間保持
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再取得しない
    retry: 1,
    meta: {
        source: 'useStamps hook'
    }
  });

  useEffect(() => {
    const cachedData = queryClient.getQueryData(STAMPS_CACHE_KEY);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Stamps] Mount check - Cache state:', 
        cachedData ? 'キャッシュあり' : 'キャッシュなし');
    }
  }, [queryClient]);
  
  // スタンプデータを明示的に更新する関数
  const refreshStamps = async () => {
    console.log('[Stamps] Manually refreshing stamps data');
    return queryClient.fetchQuery({
      queryKey: ['stamps'],
      queryFn: fetchStamps,
    });
  };
  
  // スタンプがクリアされたことを通知する関数（キャッシュ無効化）
  const invalidateStamps = () => {
    console.log('[Stamps] Invalidating stamps cache');
    return queryClient.invalidateQueries({ queryKey: ['stamps'] });
  };
  
  // スタンプデータのキャッシュを完全に削除する関数
  const clearStamps = () => {
    console.log('[Stamps] Clearing stamps cache completely');
    return queryClient.removeQueries({ queryKey: ['stamps'] });
  };
  
  // 特定のデータをキャッシュに強制的に設定する（主にテストやリセット用）
  const setStampsData = (data: StampsResponse | null) => {
    console.log('[Stamps] Manually setting stamps data:', data ? '設定' : 'クリア');
    if (data === null) {
      return queryClient.removeQueries({ queryKey: ['stamps'] });
    }
    return queryClient.setQueryData(['stamps'], data);
  };
  
  return {
    ...query,
    refresh: refreshStamps,
    invalidate: invalidateStamps,
    clear: clearStamps,
    setData: setStampsData,
  };
}
