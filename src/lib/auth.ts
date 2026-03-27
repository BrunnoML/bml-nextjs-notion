import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: "ApT Admin <noreply@brunnoml.com.br>",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      return user.email === ADMIN_EMAIL;
    },
    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.email = token.email as string;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
