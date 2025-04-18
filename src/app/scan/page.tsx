'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [message, setMessage] = useState('スタンプ処理中...');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const doScan = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const spotParam = urlParams.get('spot');
      const spot = spotParam ? Number(spotParam) : null;
      const userId = urlParams.get('userId');
      const password = urlParams.get('password');

      // console.log('URL Params:', { spot, userId, password });

      if (!spot || !userId || !password) {
        setMessage('URLパラメータが不足しています');
        return;
      }

      try {
          // ここで stamp に POST
          const stampRes = await fetch('/api/stamp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lat: 0,
              lng: 0,
              stampId: spot,
              password: password,
              frontPublicId: userId,
            }),
          });
          const res = await stampRes.json()
          if (res.status==200) {
            setSuccess(true);
            setMessage('スタンプが記録されました！');
          } else {
            setMessage(`スタンプ記録に失敗しました:${res.message}`);
          }
      } catch (err) {
        console.error(err);
        setMessage('通信エラーが発生しました');
      }
    };

    doScan();
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow text-center">
        <h1 className="text-xl font-bold mb-4">QRスキャン結果</h1>
        <p className={`text-lg ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      </div>
    </div>
  );
}
