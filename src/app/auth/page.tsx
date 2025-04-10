'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import LoginComponent from '@/app/components/auth/login';
import SignUpComponent from '@/app/components/auth/signup';

export default function AuthPage() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [authType, setAuthType] = useState('login');
    // const { data: session } = useSession();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <div>
            {authType === 'login' ? (
                <LoginComponent form={form} handleChange={handleChange}  />
            ) : (
                <SignUpComponent form={form} handleChange={handleChange} setAuthType={setAuthType} />
            )}

<div>
            <button 
                onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
            >
                {authType === 'login' ? 'サインアップはこちら' : 'ログインはこちら'}
            </button>
            </div>
        </div>
    );
}
