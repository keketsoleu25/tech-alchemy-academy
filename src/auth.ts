import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const learner = await prisma.user.findUnique({
          where: {
            email: parsed.data.email.toLowerCase(),
          },
        });

        if (!learner?.passwordHash) {
          return null;
        }

        const passwordMatches = await compare(
          parsed.data.password,
          learner.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: learner.id,
          name: learner.name,
          email: learner.email,
          image: learner.image,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth: session }) {
      return Boolean(session?.user);
    },
  },
});
