import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      // On first sign-in, upsert the user in DB and store their id in the token
      if (account && profile?.email) {
        try {
          const user = await prisma.user.upsert({
            where: { email: profile.email },
            update: { name: profile.name ?? undefined, image: (profile as any).picture ?? undefined },
            create: { email: profile.email, name: profile.name ?? undefined, image: (profile as any).picture ?? undefined },
            select: { id: true },
          });
          token.userId = user.id;
        } catch (e) {
          console.error('User upsert failed:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (token.userId) session.userId = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handlers as authOptions };
