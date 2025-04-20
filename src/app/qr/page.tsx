'use client'

//QR作成後、このページは削除
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { spotPasswords, SpotKey } from '../lib/spot-passwords';
import { useEffect } from 'react';

export default function QRPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     router.push('/auth');
  //   }
  // }, [status, router]);

  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       読み込み中...
  //     </div>
  //   );
  // }

  const publicId = 123;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((spot) => (
              <div
                key={spot}
                className="border-4 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center"
              >
                <h2 className="text-xl font-bold mb-4">Spot {spot}</h2>
                <QRCodeSVG
                  value={`${baseUrl}/scan?spot=${spot}&userId=${publicId}&password=${spotPasswords[`spot${spot}` as SpotKey]}`}
                  size={200}
                  level="H"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}