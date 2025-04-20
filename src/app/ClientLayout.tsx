'use client';

import AuthContext from './context/AuthContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthContext>{children}</AuthContext>;
}