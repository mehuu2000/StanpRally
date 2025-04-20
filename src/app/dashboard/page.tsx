'use client';

import { Container, Typography, Paper, Box, Card, CardContent, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import DashboardHeader from '@/app/components/dashboard/header';
import { Collections } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react'
import { Stamps } from "@prisma/client"
import { useAuthSession } from '@/app/hooks/useAuthSession';
import { useStamps } from '@/app/hooks/useStamps';

// スタンプ名のみの情報（表示用）
const stampNames = {
  1: 'KUシンフォニーホール',
  2: '凛風館4F',
  3: '悠久の庭',
  4: '千里庵',
  5: '凛風館1F',
};

export default function DashboardPage() {
  // const { data: session, status } = useSession();
  const { status } = useAuthSession();
  const router = useRouter();
  // const [stamps, setStamps] = useState<Stamps>()
  const { data, isLoading: stampsLoading, error } = useStamps();
  // const [loading, setLoading] = useState(true)
  
  // useEffect(() => {
  //   const fetchStamps = async () => {
  //     try {
  //       const res = await fetch('/api/stamp', {
  //         method: 'GET',
  //         credentials: 'include', // セッションCookieが必要な場合
  //       })
  //       const json = await res.json()
  //       if (res.ok) {
  //         setStamps(json.data.stamps)
  //       } else {
  //         console.error('エラー:', json.message)
  //       }
  //     } catch (err) {
  //       console.error('通信エラー:', err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchStamps()
  // }, [])
  // セッションの読み込み中
  if (status === 'loading' || stampsLoading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress sx={{ color: '#f97316' }} />
        <Typography className="ml-3 text-orange-600">読み込み中...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box className="flex justify-center items-center min-h-screen flex-col">
        <Typography className="text-red-600 mb-4">データの読み込みに失敗しました</Typography>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          再読み込み
        </button>
      </Box>
    );
  }
  
  // 未認証の場合、ログインページにリダイレクト
  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  if (!data?.data?.stamps) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography className="text-orange-600">データがありません</Typography>
      </Box>
    );
  }
  // 収集したスタンプの数
  const stamps = data.data.stamps;
  const collectedCount = stamps.count;

  type StampKeys = keyof Pick<Stamps, 'stamp1' | 'stamp2' | 'stamp3' | 'stamp4' | 'stamp5'>;

  const stampKeys: StampKeys[] = ['stamp1', 'stamp2', 'stamp3', 'stamp4', 'stamp5'];
  
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
                {collectedCount}/{5}
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
            {stampKeys.map((key,stampIndex) => {
                const isCollected = stamps[key]
                return (
                  <Grid key={key} component="div">
                    <Box className="flex flex-col items-center">
                      <Box
                        className="relative w-32 h-32 mb-3 rounded-full overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                        sx={{
                          background: isCollected
                            ? 'rgba(249, 115, 22, 0.05)'
                            : 'rgba(229, 231, 235, 0.1)',
                        }}
                      >
                        <Image
                          src={isCollected ? `/${key}.png` : '/stampnot.png'}
                          alt={stampNames[stampIndex+1 as keyof typeof stampNames]}
                          width={128}
                          height={128}
                        />
                      </Box>
                      <Typography variant="subtitle1" className="font-medium text-center text-gray-800">
                      {stampNames[stampIndex+1 as keyof typeof stampNames]}
                      </Typography>
                      <Typography
                        variant="caption"
                        className={`text-center mt-1 px-3 py-1 rounded-full ${
                          isCollected ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {isCollected ? '収集済み' : '未収集'}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })
            }
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}