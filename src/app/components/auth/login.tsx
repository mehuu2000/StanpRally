'use client';

import React from 'react'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/app/statics/styles/auth/auth.module.css';

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
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await signIn('credentials', {
                email: form.email,
                password: form.password,
                redirect: false,
            });
            
            if (response?.ok) {
                console.log('ログイン成功:', response);
                router.push('/'); // リダイレクト先のパスを指定
                router.refresh(); // セッション状態を更新
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

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            <label htmlFor="email">メールアドレス</label>
            <input 
                type="email" 
                name="email"
                className={styles.input}
                value={form.email}
                onChange={handleChange}
            />
            <label htmlFor="password">パスワード</label>
            <input 
                type="password"
                name="password"
                className={styles.input}
                value={form.password}
                onChange={handleChange}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
        </form>
  );
}

export default LoginComponent