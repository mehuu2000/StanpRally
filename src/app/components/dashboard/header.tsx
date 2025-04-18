'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Avatar, 
  Box,
  Button
} from '@mui/material';

export default function DashboardHeader() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth' });
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