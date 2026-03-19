import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/actions/stripe-actions";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  const isPro = user?.plan === "PRO";

  return (
    <div className='max-w-4xl mx-auto pb-12'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
          Paket & Berlangganan
        </h1>
        <p className='text-gray-500 mt-2'>
          Pilih paket yang sesuai dengan kebutuhan bisnis Anda.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* PAKET FREE */}
        <div className='bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col'>
          <h2 className='text-xl font-bold text-gray-900'>Mulai (Free)</h2>
          <p className='text-gray-500 mt-2 text-sm'>
            Cocok untuk mencoba dan kedai kecil.
          </p>
          <div className='my-6'>
            <span className='text-4xl font-extrabold text-gray-900'>Rp 0</span>
            <span className='text-gray-500'>/selamanya</span>
          </div>
          <ul className='space-y-4 flex-1 mb-8'>
            <li className='flex items-center gap-3 text-gray-600'>
              <span className='text-green-500'>✔</span> Maksimal 10 Menu
            </li>
            <li className='flex items-center gap-3 text-gray-600'>
              <span className='text-green-500'>✔</span> QR Code Standard
            </li>
            <li className='flex items-center gap-3 text-gray-600'>
              <span className='text-green-500'>✔</span> 1 Tema Warna
            </li>
            <li className='flex items-center gap-3 text-gray-400'>
              <span className='text-gray-300'>✖</span> Analytics Lanjutan
            </li>
          </ul>
          <button
            disabled
            className='w-full py-3 px-4 bg-gray-100 text-gray-500 font-bold rounded-xl cursor-not-allowed'
          >
            {isPro ? "Paket Lama Anda" : "Paket Anda Saat Ini"}
          </button>
        </div>

        {/* PAKET PRO (Bintang Utamanya) */}
        <div className='bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-xl flex flex-col relative overflow-hidden'>
          {/* Pita / Ribbon kecil */}
          <div className='absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider'>
            Populer
          </div>

          <h2 className='text-xl font-bold text-white'>Bisnis (PRO)</h2>
          <p className='text-gray-400 mt-2 text-sm'>
            Untuk restoran yang ingin tampil profesional.
          </p>
          <div className='my-6'>
            <span className='text-4xl font-extrabold text-white'>
              Rp 49.000
            </span>
            <span className='text-gray-400'>/bulan</span>
          </div>
          <ul className='space-y-4 flex-1 mb-8'>
            <li className='flex items-center gap-3 text-gray-300'>
              <span className='text-blue-400'>✔</span> <b>Unlimited</b> Menu
            </li>
            <li className='flex items-center gap-3 text-gray-300'>
              <span className='text-blue-400'>✔</span> QR Code Premium
            </li>
            <li className='flex items-center gap-3 text-gray-300'>
              <span className='text-blue-400'>✔</span> Kustomisasi Tema Tak
              Terbatas
            </li>
            <li className='flex items-center gap-3 text-gray-300'>
              <span className='text-blue-400'>✔</span> Analytics Pengunjung
            </li>
          </ul>

          {isPro ? (
            <button
              disabled
              className='w-full py-3 px-4 bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-600/30'
            >
              Anda Sudah PRO 🎉
            </button>
          ) : (
            // Form untuk memicu Server Action
            <form action={createCheckoutSession}>
              <button
                type='submit'
                className='w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 hover:shadow-lg transition-all transform active:scale-95'
              >
                Upgrade ke PRO Sekarang
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
