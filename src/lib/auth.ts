import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db"; // Ini file Prisma Client yang kita buat sebelumnya
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Menghubungkan NextAuth dengan database kita via Prisma
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt", // Menggunakan JSON Web Token
  },
  pages: {
    signIn: "/login", // Mengarahkan user ke halaman custom login kita (nanti kita buat)
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "budi@toko.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        // Cari user di database
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("User tidak ditemukan");
        }

        // Cek apakah password cocok
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Password salah");
        }

        // Kembalikan data user jika sukses login
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    // Menyimpan User ID di dalam token agar bisa diakses di seluruh aplikasi
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Memasukkan token ID ke dalam session yang aktif
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};