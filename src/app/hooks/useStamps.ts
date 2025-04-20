'use client';

import { useQuery } from '@tanstack/react-query';
import { Stamps } from "@prisma/client";

interface StampsResponse {
    data: {
      stamps: Stamps;
    };
}

// APIからスタンプデータを取得する関数
const fetchStamps = async (): Promise<StampsResponse> => {
  const res = await fetch('/api/stamp', {
    method: 'GET',
    credentials: 'include', // セッションCookieを含める
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch stamps');
  }
  
  return res.json();
};

// スタンプデータを取得・キャッシュするカスタムフック
export function useStamps() {
    return useQuery<StampsResponse, Error>({
    queryKey: ['stamps'],
    queryFn: fetchStamps,
    staleTime: 30 * 60 * 1000, // 3分間キャッシュ（AuthContextと一致）
    gcTime: 60 * 60 * 1000, // 5分間保持
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再取得しない
    retry: 1,
  });
}