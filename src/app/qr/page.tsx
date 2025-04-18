'use client'

//QR作成後、このページは削除
// import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { spotPasswords, SpotKey } from '../lib/spot-passwords';
import { useSession } from 'next-auth/react';

export default function QRPage() {
  // const [userId, setUserId] = useState<number | null>(null);
  // const [error, setError] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!session || !session.user?.publicId) {
      // setError("sessionがありません")
      return
  }
  const publicId = session.user.publicId
  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     try {
  //       const response = await fetch('/api/auth');
  //       const { user } = await response.json();
        
  //       if (!user) {
  //         router.push('/login');
  //         return;
  //       }
        
  //       // setUserId(user.id);
  //     } catch (error) {
  //       setError('ユーザーIDの取得に失敗しました');
  //     }
  //   };

  //   fetchUserId();
  // }, [router]);

  if (!publicId) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">読み込み中...</div>;
  }
  
// 172.28.8.188は仮置きで、配置先が決まれば変更しなければならない
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((spot) => (
              <div key={spot} className="border-4 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">Spot {spot}</h2>
                <QRCodeSVG
                  value={`${baseUrl}/scan?spot=${spot}&userId=${publicId}&password=${spotPasswords[`spot${spot}` as SpotKey]}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {error && <p className="text-red-500 text-center mt-4">{error}</p>} */}
    </div>
  );
} 