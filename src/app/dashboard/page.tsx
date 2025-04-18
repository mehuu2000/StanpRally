'use client';

import { useSession } from 'next-auth/react';
import { Container, Typography, Paper, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import Image from 'next/image';
import DashboardHeader from '@/app/components/dashboard/header';
import { Collections } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// 仮
interface StampInfo {
  id: number;
  collected: boolean;
}

// スタンプ名のみの情報（表示用）
const stampNames = {
  1: 'KUシンフォニーホール',
  2: '凛風館4F',
  3: '悠久の庭',
  4: '千里庵',
  5: '凛風館1F',
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // セッションの読み込み中
  if (status === 'loading') {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress sx={{ color: '#f97316' }} />
        <Typography className="ml-3 text-orange-600">読み込み中...</Typography>
      </Box>
    );
  }
  
  // 未認証の場合、ログインページにリダイレクト
  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  // 仮のスタンプデータ
  const stampData: StampInfo[] = [
    { id: 1, collected: true },
    { id: 2, collected: true },
    { id: 3, collected: false },
    { id: 4, collected: true },
    { id: 5, collected: false },
  ];
  
  // 収集したスタンプの数
  const collectedCount = stampData.filter(stamp => stamp.collected).length;

  return (
    <div className="min-h-screen bg-orange-50">
      <DashboardHeader />
      
      <Container maxWidth="lg" className="py-8">
        <Paper elevation={0} className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-6 rounded-lg mb-8">
          <Box className="flex items-center justify-between">
            <Box>
              <div className="text-sm mb-2">
                2025文化フェスティバル
              </div>
              <div className="text-lg font-bold mb-2">
                デジタルスタンプラリー
              </div>
            </Box>
            <Box className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
              <Typography variant="h4" className="font-bold">
                {collectedCount}/{stampData.length}
              </Typography>
              <Typography variant="body2">
                収集済み
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Card className="mb-8 shadow-sm overflow-hidden">
          <Box className="bg-orange-600 py-3 px-6">
            <Typography variant="h6" className="font-semibold text-white flex items-center">
              <Collections className="mr-2" />
              スタンプコレクション
            </Typography>
          </Box>
          <CardContent className="p-6">
            <Grid container spacing={5} justifyContent="center">
              {stampData.map((stamp) => (
                <Grid item xs={6} sm={4} md={2.4} key={stamp.id}>
                  <Box className="flex flex-col items-center">
                    <Box 
                      className="relative w-32 h-32 mb-3 rounded-full overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      sx={{
                        background: stamp.collected ? 'rgba(249, 115, 22, 0.05)' : 'rgba(229, 231, 235, 0.1)',
                      }}
                    >
                      <Image
                        src={stamp.collected ? `/stamp${stamp.id}.png` : '/stampnot.png'}
                        alt={stampNames[stamp.id as keyof typeof stampNames]}
                        width={128}
                        height={128}
                      />
                    </Box>
                    <Typography variant="subtitle1" className="font-medium text-center text-gray-800">
                      {stampNames[stamp.id as keyof typeof stampNames]}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className={`text-center mt-1 px-3 py-1 rounded-full ${
                        stamp.collected 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {stamp.collected ? '収集済み' : '未収集'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}