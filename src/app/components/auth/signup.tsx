'use client';

import React from 'react'
import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/app/statics/styles/auth/auth.module.css';

const COOKIE_ID = 'device_uuid';
// const COOKIE_NEWID = 'new_device_uuid';
const COOKIE_EXPIRY_DAYS = 30;

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
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [cookieUUID, setCookieUUID] = useState<string | null>(null);
    const [newCookieUUID, setNewCookieUUID] = useState<string | null>(null);
    const [deviceReady, setDeviceReady] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!deviceReady) {
            setError('デバイス情報を準備中です。しばらくお待ちください。');
            return;
        }
        // ...サインアップ処理の実装
        setIsLoading(true);
        setError('');
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
              // エラー処理
              setError(data.message || 'アカウント作成に失敗しました');
              console.error('サインアップエラー:', data);
            } else {
              // 成功処理
              setSuccess('アカウント作成に成功しました！ログインページに移動します...');
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