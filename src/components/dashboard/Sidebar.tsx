"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Solusi Aman: Gunakan useEffect untuk menutup sidebar saat URL berubah
  useEffect(() => {
    // Kalau sidebar sedang terbuka, otomatis tutup saat pindah halaman
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Daftar menu navigasi
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Daftar Menu",
      href: "/dashboard/menu",
      icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
    },
    {
      name: "Pengaturan Toko",
      href: "/dashboard/settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      name: "Tagihan & Paket",
      href: "/dashboard/billing",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR (Hanya muncul di HP) --- */}
      <div className='md:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 px-4 py-4 flex items-center justify-between shadow-sm'>
        <span className='font-extrabold text-xl text-blue-600 tracking-tight'>
          SaaS Menu
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-gray-500 hover:text-gray-900 focus:outline-none p-1 relative z-50'
        >
          {isOpen ? (
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          ) : (
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          )}
        </button>
      </div>

      {/* --- OVERLAY GELAP (Hanya di HP, kalau menu kebuka) --- */}
      {isOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR UTAMA --- */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 flex flex-col shadow-xl md:shadow-none
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className='hidden md:flex items-center justify-center h-20 border-b border-gray-100 px-6'>
          <span className='font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 tracking-tight'>
            SaaS Menu
          </span>
        </div>

        <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto mt-16 md:mt-0'>
          {menuItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-gray-100'>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className='flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
