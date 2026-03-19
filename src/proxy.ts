import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Di Next.js 16, nama fungsinya wajib 'proxy', bukan 'middleware' lagi
export async function proxy(request: NextRequest) {
  // Satpam mengecek tiket (token sesi NextAuth) dari pengunjung
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // ATURAN 1: Jika pengunjung mencoba masuk ke area "/dashboard" (termasuk billing, dll)
  if (url.pathname.startsWith("/dashboard")) {
    // ATURAN 2: Jika mereka TIDAK punya tiket (belum login)
    if (!token) {
      // Tendang / arahkan mereka kembali ke halaman login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Jika tiketnya valid atau mereka cuma buka halaman depan (Homepage), silakan lewat!
  return NextResponse.next();
}

// Konfigurasi ini memberi tahu Next.js rute mana saja yang harus dijaga ketat oleh Satpam
export const config = {
  matcher: [
    /*
     * Match semua rute yang berawalan "/dashboard"
     * Contoh yang dijaga: /dashboard, /dashboard/billing, /dashboard/settings
     */
    "/dashboard/:path*",
  ],
};
