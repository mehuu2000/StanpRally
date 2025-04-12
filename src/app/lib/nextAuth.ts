import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'
import prisma from "@/app/lib/prisma";

declare module "next-auth" {
    interface Session {
        user: {
            publicId: string;
            name: string;
            email: string;
        };
    }
  
    interface User {
        id: number;
        publicId : string;
        name?: string;
        email: string;
    }
  
    interface JWT {
        id: number;
        publicId: string;
        name: string;
        email: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                  console.log("メールアドレスまたはパスワードがありません");
                  throw new Error('メールアドレスまたはパスワードが存在しません');
                }
                
                // メールアドレスに一致するユーザーをデータベースから取得
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
  
                // ユーザーが存在する場合
                if (user && user.hashedPassword) {
                    // パスワードを検証
                    const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
                    if (isValid) {
                        return {
                            id: user.id,
                            publicId: user.publicId,
                            name: user.name,
                            email: user.email,
                        }
                    } else {
                        throw new Error('パスワードが一致しません');
                    }
                }
          
                // 認証失敗
                throw new Error('ユーザーが見つかりません');
            },
        }),
    ],
    pages: {
        signIn: '/auth',
        error: '/auth',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.publicId = user.publicId;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    publicId: token.publicId as string,
                    name: token.name as string,
                    email: token.email as string,
                };
            }
            return session;
        },
    },
};