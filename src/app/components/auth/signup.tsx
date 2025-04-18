'use client';

import React from 'react'
import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, InputAdornment, IconButton, Alert, Box, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const COOKIE_ID = 'device_uuid';
const COOKIE_EXPIRY_DAYS = 30;

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

function SignUpComponent({ form, handleChange, setAuthType }: SignUpProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMail, setErrorMail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorName, setErrorName] = useState('');
    const [success, setSuccess] = useState('');
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [cookieUUID, setCookieUUID] = useState<string | null>(null);
    const [newCookieUUID, setNewCookieUUID] = useState<string | null>(null);
    const [deviceReady, setDeviceReady] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // デバイス識別情報を初期化
    useEffect(() => {
        async function initDevice() {
            try {
                // Fingerprintingを使ってデバイスIDを毎回生成
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                const visitorIdentifier = result.visitorId;
                console.log('visitorIdを生成:', visitorIdentifier);
                setVisitorId(visitorIdentifier);
                
                // デバイスUUID用のCookieを確認
                const existingCookie = Cookies.get(COOKIE_ID);
                if (existingCookie) {
                    setCookieUUID(existingCookie);
                    console.log('既存のcookieUUIDを取得:', existingCookie);
                } else {
                    const newUuid = uuidv4();
                    setNewCookieUUID(newUuid);
                    console.log('新しいnewCookieUUIDを生成:', newUuid);
                }
                setDeviceReady(true);
            } catch (error) {
                console.error('デバイス識別エラー:', error);
                setError('デバイス識別に失敗しました。ブラウザの設定を確認してください。');
                setDeviceReady(true); // エラーでも処理は続行できるようにする
            }
        }
        
        initDevice();
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!deviceReady) {
            setError('デバイス情報を準備中です。しばらくお待ちください。');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setErrorMail('');
        setErrorPassword('');
        setSuccess('');

        try {
            console.log(`name: ${form.name}, email: ${form.email}, password: ${form.password}`);
            console.log(`visitorId: ${visitorId}, cookieUUID: ${cookieUUID}, newCookieUUID: ${newCookieUUID}`);
            // サインアップAPI呼び出し
            const response = await fetch('/api/auth/signUp', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: form.name,
                email: form.email,
                password: form.password,
                visitorId,       // Fingerprintingで生成したID
                cookieUUID,      // 既存のCookie UUID (あれば)
                newCookieUUID     // 新たに生成したUUID (あれば)
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
                setSuccess(`アカウントが作成され、${form.email}に確認メールを送信しました。ログインページに移動します...`);
                console.log('サインアップ成功:', data);

              // 成功時に新しいUUIDをCookieに保存
              if (newCookieUUID) {
                Cookies.set(COOKIE_ID, newCookieUUID, {
                    expires: COOKIE_EXPIRY_DAYS,
                    sameSite: 'strict'
                });
                console.log('新しいUUIDをCookieに保存:', newCookieUUID);
              }
              
              // 成功したら2秒後にログインページにリダイレクト
              setTimeout(() => {
                setAuthType('login');
              }, 5000);
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
                    disabled={isLoading || !deviceReady}
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
                    ) : !deviceReady ? (
                        'デバイス情報を準備中...'
                    ) : (
                        'サインアップ'
                    )}
                </Button>
            </Box>
        </form>
    );
};

export default SignUpComponent