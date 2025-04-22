'use client';

import React from 'react'
import { useState, useEffect } from 'react';
import { TextField, Button, InputAdornment, IconButton, Alert, Box, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles  from '@/app/statics/styles/auth/adminAuth.module.css';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface SignUpProps {
    form: {
      name: string;
      email: string;
      password: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setAuthType: (type: string) => void;
}

interface ValidationError {
    code: string;
    message: string;
    path?: string[];
    validation?: string;
    minimum?: number;
    inclusive?: boolean;
    exact?: boolean;
    type?: string;
}

function SignUpComponen() {
    const [form, setForm] = useState({
            name: '',
            email: '',
            password: '',
        });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMail, setErrorMail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorName, setErrorName] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (!session || !session.user?.publicId) {
          router.push('/auth')
          return
        }
        if (session.user.email !== "xppn772p8xdwt9iq@gmail.com") {
          router.push('/dashboard')
          return
        }
    }, [router]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError('');
        setErrorMail('');
        setErrorPassword('');
        setSuccess('');

        try {
            // サインアップAPI呼び出し
            const response = await fetch('/api/auth/signUpDev', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: form.name,
                email: form.email,
                password: form.password,
              }),
            });
      
            const data = await response.json();
      
            if (!response.ok) {
                console.log(data.message || 'アカウント作成に失敗しました');
              
                // エラー処理
                if (data.error && Array.isArray(data.error)) {
                  // 全てのエラーメッセージをリセット
                  setErrorMail('');
                  setErrorPassword('');
                  setErrorName('');
                  
                  // 各エラーを適切なフィールドに割り当てる
                  data.error.forEach((err: ValidationError) => {
                    if (err.path && err.path.length > 0) {
                      const fieldName = err.path[0];
                      const errorMessage = err.message;
                      
                      switch (fieldName) {
                        case 'email':
                          setErrorMail(errorMessage);
                          break;
                        case 'password':
                          setErrorPassword(errorMessage);
                          break;
                        case 'name':
                          setErrorName(errorMessage);
                          break;
                        default:
                          // 未知のフィールドのエラーは一般エラーとして表示
                          setError(prevError => prevError 
                            ? `${prevError}\n${errorMessage}` 
                            : errorMessage);
                      }
                    }
                  });
                } else {
                  // データ構造が予期しない場合は一般エラーとして表示
                  setError(data.message || 'アカウント作成に失敗しました');
                }
                console.error('サインアップエラー:', data);
              } else {
                // 成功処理 - 変更なし
                setSuccess(`アカウントが作成され、${form.email}に確認メールを送信しました。`);
                console.log('サインアップ成功:', data);
            }
          } catch (err) {
            // ネットワークエラーなどの例外処理
            setError('サーバーとの通信中にエラーが発生しました。');
            console.error('サインアップ中の例外:', err);
          } finally {
            setIsLoading(false);
          }
    };

    return (
        <div className={styles.authContainer}>
            <div>
            <button onClick={() => router.push('/admin/stamps')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded border border-gray-300">
                スタンプ管理画面に移動
            </button>
            <span className="mx-2"></span>
            <button onClick={() => router.push('/admin/rand')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded border border-gray-300">
                抽選管理画面に移動
            </button>
            </div>
            <h1 className="text-2xl font-bold text-center mb-4">新規登録</h1>
            <div className={styles.authHeader}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                    {success && <Alert severity="success" className="mb-4" sx={{ backgroundColor: '#ffedd5', color: '#9a3412' }}>
                        {success}
                    </Alert>}
                    
                    <TextField
                        fullWidth
                        required
                        label="メールアドレス"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!errorMail}
                        helperText={errorMail}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon className="text-orange-400" />
                                </InputAdornment>
                            ),
                        }}
                        className="bg-white"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f97316',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#f97316',
                            },
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        required
                        label="パスワード"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!errorPassword}
                        helperText={errorPassword}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon className="text-orange-400" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                        className="text-gray-500 hover:text-orange-500"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        className="bg-white"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f97316',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#f97316',
                            },
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        required
                        label="名前"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        variant="outlined"
                        error={!!errorName}
                        helperText={errorName}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon className="text-orange-400" />
                                </InputAdornment>
                            ),
                        }}
                        className="bg-white"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#f97316',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#f97316',
                            },
                        }}
                    />
                    
                    <Box className="pt-2">
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-600 py-3 normal-case text-base font-medium"
                            sx={{
                                backgroundColor: '#f97316',
                                '&:hover': {
                                    backgroundColor: '#ea580c',
                                },
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} className="text-white" />
                            ) : (
                                'サインアップ'
                            )}
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default SignUpComponen