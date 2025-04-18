'use client';

import { useState } from 'react';
import { Paper, Container, Box, Typography, Button } from '@mui/material';
import LoginComponent from '@/app/components/auth/login';
import SignUpComponent from '@/app/components/auth/signup';

export default function AuthPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [authType, setAuthType] = useState('login');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <Container maxWidth="sm" className="py-12">
            <Paper elevation={3} className="p-8 rounded-lg">
                <Box className="flex flex-col items-center mb-6">
                    <Typography variant="h5" component="h1" className="text-center mb-2 font-bold text-orange-600">
                        {authType === 'login' ? 'デジタルスタンプラリー' : '新規登録'}
                    </Typography>
                </Box>

                <Box className="mb-6">
                    {authType === 'login' ? (
                        <LoginComponent form={form} handleChange={handleChange} />
                    ) : (
                        <SignUpComponent form={form} handleChange={handleChange} setAuthType={setAuthType} />
                    )}
                </Box>

                <Box className="text-center pt-4 border-t border-gray-200">
                    <Typography variant="body2" className="text-gray-600 mb-2">
                        {authType === 'login' ? 'アカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？'}
                    </Typography>
                    <Button 
                        onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
                        variant="text"
                        className="text-blue-600 hover:text-blue-600"
                    >
                        {authType === 'login' ? 'サインアップはこちら' : 'ログインはこちら'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}