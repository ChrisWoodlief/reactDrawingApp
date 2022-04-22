import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const TA_BASE_URL = 'localhost:3000';

import { PrismaClient } from '@prisma/client';
let prisma;

export default NextAuth({
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "React Drawing App",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {

        prisma = new PrismaClient();
        const userById = await prisma.user.findUnique({
          where: {
            email: credentials.username
          }
        });


        // If no error and we have user data, return it
        if (userById) {
          return {
            name: userById.name,
            email: userById.email,
            id: userById.id
          };
        }

        // Return null if user data could not be retrieved
        return null;
      },
    })
  ],
  pages: {
    //signIn: "/Login",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },
  // customer sign in page
  // pages: {
  //   signIn: "/login",
  // },
  callbacks: {
    async session({ session, token, user }) {
      session.ta_token = token.ta_token;
      session.userId = token.sub; //todo look into why the id is on the token as "sub"
      return session;
    },
    async jwt({ token, user }) {
      if (user?.ta_token) {
        // @ts-ignore
        token.ta_token = user?.ta_token;
      }
      return token;
    },
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
});
