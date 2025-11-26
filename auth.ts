import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim();
        const password = credentials?.password?.toString();

        if (!email || !password) {
          return null;
        }

        const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const foundUser = result[0];
        if (!foundUser) return null;

        const isPasswordValid = await compare(password, foundUser.password);
        if (!isPasswordValid) return null;

        const user: User = {
          id: foundUser.id.toString(),
          email: foundUser.email,
          name: foundUser.fullName,
        };

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
