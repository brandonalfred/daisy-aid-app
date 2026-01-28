import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/admin-tooling/login',
    error: '/admin-tooling/login',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const admin = await prisma.admin.findFirst({
        where: { email: user.email, deletedAt: null },
      });

      if (!admin) {
        return '/admin-tooling/login?error=AccessDenied';
      }

      await prisma.admin.update({
        where: { email: user.email },
        data: { lastLoginAt: new Date() },
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const admin = await prisma.admin.findFirst({
          where: { email: user.email, deletedAt: null },
        });

        if (admin) {
          token.adminId = admin.id;
          token.firstName = admin.firstName;
          token.lastName = admin.lastName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.adminId) {
        session.user.adminId = token.adminId as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },
});
