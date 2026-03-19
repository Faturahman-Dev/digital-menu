"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Jika sukses, arahkan ke halaman login
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Buat Akun Tenant</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" name="name" required className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required minLength={6} className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}