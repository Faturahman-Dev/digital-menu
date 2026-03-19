export { default } from "next-auth/middleware";

export const config = {
  // Hanya rute di bawah ini yang akan diproteksi oleh satpam NextAuth
  matcher: [
    "/dashboard/:path*", // Memproteksi semua halaman di dalam /dashboard
  ],
};