'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type User = {
  name: string | null;
  email: string | null;
  publicId: string | null;
};

export default function TopPage() {
    const { data: session } = useSession();
    const [ currentUser, setCurrentUser ] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(session) {
          setCurrentUser(session.user);
        }
    }, [session]);

    return (
        <div>
            {currentUser ? (
              <div>
                  <p>Welcome, {currentUser.name}</p>
                  <p>Your email, {currentUser.email}</p>
                  <p>Your userId, {currentUser.publicId}</p>
                  <button onClick={() => router.push('/auth')}>認証ページへ</button>
              </div>
            ) : (
              <div>
                <p>ログインしてください</p>
                <button onClick={() => router.push('/auth')}>認証ページへ</button>
              </div>
            )}
        </div>
    );
}