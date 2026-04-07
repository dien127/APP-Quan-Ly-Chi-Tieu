import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/lib/auth.config';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

if (!process.env.AUTH_SECRET && process.env.NODE_ENV === 'production') {
  process.env.AUTH_SECRET = 'baicuoiki-secret-key-fallback-32-chars-long';
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || 'baicuoiki-super-secret-key-for-v5-32-chars',
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.fullName,
              image: user.avatarUrl
            };
          }
        }
        return null;
      },
    }),
  ],
});
