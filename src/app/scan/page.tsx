'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function ScanPage() {
  const [message, setMessage] = useState('スタンプ処理中...');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        if(err.message=="User denied geolocation prompt"){
          setLocation({
            latitude: 0,
            longitude: 0,
          });
        }else{
          setMessage(err.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 60000,       // 座標が取れるまで最大60秒間待機
        maximumAge: 60000         // 60秒以内ならキャッシュを使う
      }
    );
    setMessage("位置情報を処理しています。これには数十秒かかることがあります...")
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);
  
  useEffect(() => {
    if (!location) return;
    setMessage('スタンプ処理中...')
    const doScan = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const spotParam = urlParams.get('spot');
      const spot = spotParam ? Number(spotParam) : null;
      // const userId = urlParams.get('userId');
      const password = urlParams.get('password');
  
      if (!spot || !password) {
        setMessage('URLパラメータが不足しています');
        return;
      }
      
      try {
        const stampRes = await fetch('/api/stamp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: location.latitude,
            lng: location.longitude,
            stampId: spot,
            password: password,
            // frontPublicId: userId,
          }),
        });
        const res = await stampRes.json();
        if (res.status === 200) {
          setSuccess(true);
          setMessage('スタンプが記録されました！');

          try {
            queryClient.invalidateQueries({ queryKey: ['stamps'] });
            console.log('Stamps cache invalidated successfully');
          } catch (cacheError) {
            // キャッシュ無効化に失敗した場合でも処理を継続
            console.error('Failed to invalidate cache:', cacheError);
          }
        } else {
          setMessage(`スタンプ記録に失敗しました:${res.message}`);
        }
      } catch (err) {
        console.error(err);
        setMessage('通信エラーが発生しました');
      }
  
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    };
    
    doScan();
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow text-center">
        <h1 className="text-xl font-bold mb-4">QRスキャン結果</h1>
        <p className={`text-lg ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
      </div>
    </div>
  );
}
