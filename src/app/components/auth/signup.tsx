'use client';

import React from 'react'
import { useState } from 'react';
import styles from '@/app/statics/styles/auth/auth.module.css';

interface LoginProps {
    form: {
      name: string;
      email: string;
      password: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setAuthType: (type: string) => void;
}

function SignUpComponent({ form, handleChange, setAuthType }: LoginProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // ...サインアップ処理の実装
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
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
              }),
            });
      
            const data = await response.json();
      
            if (!response.ok) {
              // エラー処理
              setError(data.message || 'アカウント作成に失敗しました');
              console.error('サインアップエラー:', data);
            } else {
              // 成功処理
              setSuccess('アカウント作成に成功しました！ログインページに移動します...');
              console.log('サインアップ成功:', data);
              
              // 成功したら2秒後にログインページにリダイレクト
              setTimeout(() => {
                // 親コンポーネントのログイン/サインアップ切り替え機能を使う場合は、
                // ここでrouter.pushではなく、親コンポーネントから渡されたsetAuthType('login')などを呼ぶとよい
                setAuthType('login');
              }, 2000);
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
        <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}
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
            <label htmlFor="name">名前</label>
            <input
                type="text"
                name="name"
                className={styles.input}
                value={form.name}
                onChange={handleChange}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'サインアップ中...' : 'サインアップ'}
            </button>
        </form>
    );
};

export default SignUpComponent