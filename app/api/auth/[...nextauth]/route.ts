import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (!existingUser) {
          await supabase.from('users').insert({
            email: user.email,
            name: user.name,
            provider: 'google'
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();
        
        if (user) {
          session.user.id = user.id;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
