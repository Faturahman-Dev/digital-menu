"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Proses login menggunakan NextAuth
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Email atau password salah.");
      setLoading(false);
    } else {
      // Jika berhasil login, arahkan ke dashboard
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md'>
        <h2 className='text-2xl font-bold text-center text-gray-900'>
          Masuk ke Dashboard
        </h2>

        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              name='email'
              required
              className='w-full px-3 py-2 mt-1 border rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              name='password'
              required
              className='w-full px-3 py-2 mt-1 border rounded-md'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:bg-gray-400'
          >
            {loading ? "Masuk..." : "Login"}
          </button>
        </form>

        <p className='text-sm text-center text-gray-600'>
          Belum punya akun?{" "}
          <Link
            href='/register'
            className='text-blue-600 hover:underline'
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
