'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useAuthSession } from '@/app/hooks/useAuthSession';
import { useStamps } from '@/app/hooks/useStamps';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  Box,
  Button
} from '@mui/material';

export default function DashboardHeader() {
  const { data: session, clear: clearSession } = useAuthSession();
  const { clear: clearStamps } = useStamps();

  const handleLogout = async () => {
    try {
      // 1. React Queryキャッシュのクリア
      clearSession();
      clearStamps();
      // queryClient.removeQueries({ queryKey: ['session'] }); // セッションキャッシュ削除
      
      // 2. Next-Authのログアウト処理
      await signOut({ callbackUrl: '/auth' });
      
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
      // エラー時は通常のログアウトにフォールバック
      signOut({ callbackUrl: '/auth' });
    }
  };

  // ユーザー名を取得（存在する場合）
  const userName = session?.user?.name || 'ゲスト';
  
  // ユーザーのイニシャルを取得（アバター表示用）
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <AppBar 
      position="static" 
      className="shadow-sm"
      sx={{ 
        backgroundColor: '#ffedd5',
        color: '#9a3412'
      }}
    >
      <Toolbar className="justify-between">
        <Box className="flex items-center justify-between w-full">
          <Box className="flex items-center">
            <Avatar className="bg-orange-500 w-8 h-8 mr-3">
              {userInitial}
            </Avatar>
            <Typography className="text-gray-700 font-medium">
              {userName}さん
            </Typography>
          </Box>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            className="font-semibold"
          >
            ログアウト
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}