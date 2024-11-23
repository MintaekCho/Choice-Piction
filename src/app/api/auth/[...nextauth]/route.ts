import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
declare module 'next-auth' {
  interface User {
    username?: string;
    role: string | null;
  }

  interface Session {
    user: {
      id: string;
      username?: string;
      role: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                username: `user_${Date.now()}`,
                profileImage: user.image,
                role: 'FREE',
              },
            });
          }

          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          user.id = existingUser.id;
          user.username = existingUser.username;
          user.role = existingUser.role;
          user.image = existingUser.profileImage;

          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    jwt({ token, user, account, trigger }) {
      console.log('--------------------------');
      console.log('JWT Callback:', { trigger, token, user });

      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }

      console.log('JWT Token Output:', token);
      console.log('--------------------------');
      return token;
    },
    session({ session, token, user }) {
      console.log('--------------------------');
      console.log('Session Callback:', { session, token, user });

      if (token && session.user) {
        session.user.id = token.id || '';
        session.user.username = token.username || '';
        session.user.role = token.role || 'FREE';
      }

      console.log('Session Output:', session);
      console.log('--------------------------');
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
