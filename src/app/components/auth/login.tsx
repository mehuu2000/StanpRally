'use client';

import React from 'react'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { TextField, Button, InputAdornment, IconButton, Alert, Box, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginProps {
    form: {
      email: string;
      password: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LoginComponent({ form, handleChange }: LoginProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
                callbackUrl,
            });

            if (response?.ok) {
                console.log('ログイン成功:', response);
                window.location.replace(response.url ?? callbackUrl);
            } else {
                setError('メールアドレスまたはパスワードが正しくありません');
            }
        } catch (err) {
            console.error('ログインエラー:', err);
            setError('ログイン処理中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert severity="error" className="mb-4">{error}</Alert>}

            <TextField
                fullWidth
                required
                label="メールアドレス"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <EmailIcon className="text-pink-400" />
                        </InputAdornment>
                    ),
                }}
                className="bg-white"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#ff1493',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ff1493',
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
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon className="text-pink-400" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                                className="text-gray-500 hover:text-pink-500"
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
                            borderColor: '#ff1493',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ff1493',
                    },
                }}
            />

            <Box className="pt-2">
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    className="bg-pink-500 hover:bg-pink-600 py-3 normal-case text-base font-medium"
                    sx={{
                        backgroundColor: '#ff1493',
                        '&:hover': {
                            backgroundColor: '#ed6ea0',
                        },
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} className="text-white" />
                    ) : (
                        'ログイン'
                    )}
                </Button>
            </Box>
        </form>
    );
}

export default LoginComponent
