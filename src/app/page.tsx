'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type User = {
  email: string | null;
  publicId: string | null;
};

export default function TopPage() {
    const { data: session } = useSession();
    const [ currentUser, setCurrentUser ] = useState<User | null>(null);

    useEffect(() => {
        if(session) {
          setCurrentUser(session.user);
        }
    }, [session]);

    return (
        <div>
            {currentUser ? (
              <div>
                  <p>Welcome, {currentUser.email}</p>
                  <p>userId, {currentUser.publicId}</p>
              </div>
            ) : (
                <p>ログインしてください</p>
            )}

        </div>
    );
}