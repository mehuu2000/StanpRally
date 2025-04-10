'use client';

import { SessionProvider } from 'next-auth/react';

// AuthContextが受け取る子要素の型定義
type AuthContextProps = {
  children: React.ReactNode;
};

// 認証コンテキスト
const AuthContext = ({ children }: AuthContextProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthContext;