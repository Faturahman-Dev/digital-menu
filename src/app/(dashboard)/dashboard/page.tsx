import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import QRCodeDisplay from "@/components/dashboard/QRCodeDisplay";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Ambil data user, toko, dan hitung jumlah menunya
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      store: {
        include: {
          menuItems: true, // Ambil data menu untuk dihitung
          categories: true, // Ambil data kategori untuk dihitung
        },
      },
    },
  });

  const store = user?.store;

  const totalViews = store
    ? await db.analytics.count({
        where: { storeId: store.id },
      })
    : 0;

  return (
    // PERUBAHAN 1: Tambah px-4 (padding HP) dan sm:px-6 (padding tablet/laptop)
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-12'>
      {/* Header Greeting */}
      <div className='mb-6 sm:mb-8'>
        {/* PERUBAHAN 2: Teks agak dikecilin dikit di HP (text-2xl) biar gak patah */}
        <h1 className='text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight'>
          Selamat datang, {session.user.name?.split(" ")[0] || "Pemilik Bisnis"}
          ! 👋
        </h1>
        <p className='text-sm sm:text-base text-gray-500 mt-2'>
          Berikut adalah ringkasan performa menu digital Anda hari ini.
        </p>
      </div>

      {!store ? (
        // --- ONBOARDING STATE (Jika belum punya toko) ---
        // PERUBAHAN 3: Padding disesuaikan untuk HP (p-6) dan Laptop (sm:p-10)
        <div className='bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-10 rounded-2xl sm:rounded-3xl text-center shadow-lg text-white'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 backdrop-blur-sm'>
            <svg
              className='w-8 h-8 sm:w-10 sm:h-10 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 10V3L4 14h7v7l9-11h-7z'
              />
            </svg>
          </div>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-3'>
            Satu Langkah Lagi!
          </h2>
          <p className='text-sm sm:text-base text-blue-100 mb-6 sm:mb-8 max-w-lg mx-auto'>
            Anda belum mengatur identitas toko. Buat profil toko Anda sekarang
            untuk mulai membuat menu digital dan mendapatkan QR Code.
          </p>
          <Link
            href='/dashboard/settings'
            className='inline-block w-full sm:w-auto bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:shadow-lg transition-all transform hover:-translate-y-1'
          >
            Setup Toko Sekarang →
          </Link>
        </div>
      ) : (
        // --- DASHBOARD UTAMA (Jika sudah punya toko) ---
        <div className='space-y-6 sm:space-y-8'>
          {/* STATISTIK CARDS */}
          {/* Grid ini udah bener dari lu, 1 kolom di HP, 2 di Tablet, 4 di Laptop */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
            {/* Card 1: Total Menu */}
            <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 10h16M4 14h16M4 18h16'
                  />
                </svg>
              </div>
              <div>
                <p className='text-xs sm:text-sm font-medium text-gray-500'>
                  Total Menu
                </p>
                <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                  {store.menuItems.length}{" "}
                  <span className='text-xs sm:text-sm font-normal text-gray-400'>
                    item
                  </span>
                </p>
              </div>
            </div>

            {/* Card 2: Total Kategori */}
            <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                  />
                </svg>
              </div>
              <div>
                <p className='text-xs sm:text-sm font-medium text-gray-500'>
                  Kategori
                </p>
                <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                  {store.categories.length}{" "}
                  <span className='text-xs sm:text-sm font-normal text-gray-400'>
                    grup
                  </span>
                </p>
              </div>
            </div>

            {/* Card 3: Pengunjung */}
            <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-xs sm:text-sm font-medium text-gray-500'>
                  Scan QR Code
                </p>
                <p className='text-xl sm:text-2xl font-bold text-gray-900'>
                  {totalViews}{" "}
                  <span className='text-xs sm:text-sm font-normal text-gray-400'>
                    kali
                  </span>
                </p>
              </div>
            </div>

            {/* Card 4: Status Paket */}
            <div className='bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-xs sm:text-sm font-medium text-gray-500'>
                  Paket Saat Ini
                </p>
                <span className='inline-flex mt-1 items-center px-2 py-0.5 rounded-md text-xs sm:text-sm font-bold bg-gray-900 text-white uppercase tracking-wider'>
                  {user?.plan}
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8'>
            {/* Kolom Kiri: Quick Actions */}
            <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
              <div className='bg-white p-5 sm:p-8 rounded-2xl border border-gray-100 shadow-sm'>
                <h3 className='text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2'>
                  ⚡ Aksi Cepat
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                  <Link
                    href='/dashboard/menu/new'
                    className='group p-4 sm:p-5 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex flex-col items-start justify-center'
                  >
                    <span className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors'>
                      +
                    </span>
                    <span className='font-bold text-sm sm:text-base text-gray-900'>
                      Tambah Menu Baru
                    </span>
                    <span className='text-[11px] sm:text-xs text-gray-500 mt-1'>
                      Masukkan hidangan baru ke etalase
                    </span>
                  </Link>
                  <a
                    href={`/${store.slug}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group p-4 sm:p-5 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left flex flex-col items-start justify-center'
                  >
                    <span className='w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors'>
                      <svg
                        className='w-4 h-4 sm:w-5 sm:h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                      </svg>
                    </span>
                    <span className='font-bold text-sm sm:text-base text-gray-900'>
                      Lihat Menu Publik
                    </span>
                    <span className='text-[11px] sm:text-xs text-gray-500 mt-1'>
                      Buka etalase digital Anda saat ini
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: QR Code (Tetap aman!) */}
            <div className='lg:col-span-1'>
              <QRCodeDisplay
                slug={store.slug}
                storeName={store.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
