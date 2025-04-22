'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/statics/styles/top.module.css';
import { Button, Typography, Box, Container, Paper } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import LoginIcon from '@mui/icons-material/Login';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function TopPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // パンフレットをダウンロードする関数
    const handleDownloadPamphlet = () => {
      try {
          // Googleドライブの共有URLからファイルIDを抽出
          const fileId = '1n6oZFc_pNlQHgUBr9XGT3IXczreeGAQe';

          const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
          
          // 新しいウィンドウで開く
          window.open(directDownloadUrl, '_blank');
          
      } catch (error) {
          console.error('パンフレットのダウンロード中にエラーが発生しました:', error);
          alert('パンフレットのダウンロードに失敗しました。もう一度お試しください。');
      }
  };

    return (
        <div className={styles.topContainer} style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #fff8f0 0%, #ffe8cc 100%)',
            padding: '2rem 0'
        }}>
            <Container maxWidth="md">
                {/* ヘッダーセクション */}
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        mb: 6,
                        pt: 4
                    }}
                >
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#FF7A00',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                        }}
                    >
                        文化フェスティバル 2025
                    </Typography>
                </Box>

                {/* メインビジュアル */}
                <Box sx={{ position: 'relative', height: { xs: '200px', sm: '250px', md: '300px' }, mb: 5, borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#FF7A00',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                            文化祭スタンプラリー
                        </Typography>
                    </div>
                </Box>

                {/* ウェルカムメッセージ */}
                <Paper elevation={3} sx={{ 
                    p: { xs: 3, md: 4 }, 
                    mb: 5, 
                    borderRadius: '12px',
                    border: '2px solid #FFD8B1'
                }}>
                    <Typography variant="h5" sx={{ color: '#FF7A00', fontWeight: 'bold', mb: 2 }}>
                        スタンプラリーで文化祭をもっと楽しもう！
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                        キャンパス内の様々な場所に設置されたQRコードをスキャンして、スタンプを集めよう。
                        すべてのスタンプを集めると、素敵な景品が当たるチャンス！
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                        キャンパスを巡りながら、関西大学の文化祭をお楽しみください。
                        さあ、スタンプラリーの冒険を始めましょう！
                    </Typography>
                </Paper>

                {/* ボタンセクション */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    justifyContent: 'center',
                    gap: { xs: 2, sm: 3 },
                    mb: 5
                }}>
                    <Button 
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={() => router.push('/auth')}
                        sx={{
                            backgroundColor: '#FF7A00',
                            color: 'white',
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
                            '&:hover': {
                                backgroundColor: '#E86800',
                            },
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(255, 122, 0, 0.3)'
                        }}
                    >
                        ログイン / 登録
                    </Button>
                    <Button 
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadPamphlet}
                        sx={{
                            color: '#FF7A00',
                            borderColor: '#FF7A00',
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem',
                            '&:hover': {
                                borderColor: '#E86800',
                                backgroundColor: 'rgba(255, 122, 0, 0.04)',
                            },
                            borderRadius: '8px'
                        }}
                    >
                        パンフレットをダウンロード
                    </Button>
                </Box>

                {/* 特典情報セクション */}
                <Paper elevation={2} sx={{ 
                    p: 3, 
                    mb: 4, 
                    borderRadius: '12px',
                    backgroundColor: '#FFF7F0',
                    border: '1px solid #FFD8B1'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEventsIcon sx={{ color: '#FFB347', mr: 1, fontSize: '2rem' }} />
                        <Typography variant="h5" sx={{ color: '#FF7A00', fontWeight: 'bold' }}>
                            参加特典
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        • すべてのスタンプを集めると抽選で豪華景品をプレゼント！
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 0 }}>
                        • キャンパスを楽しく探検しながら文化祭を満喫できます
                    </Typography>
                </Paper>

                {/* フッター */}
                <Box sx={{ textAlign: 'center', mt: 6, mb: 3, color: '#666' }}>
                    <Typography variant="body2">
                        文化フェスティバル2025 運営
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        スタンプラリー開発チーム
                    </Typography>
                </Box>
            </Container>
        </div>
    );
}