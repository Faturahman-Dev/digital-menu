import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import StoreForm from "./StoreForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Cek ke database, apakah user ini sudah punya toko sebelumnya?
  const store = await db.store.findUnique({
    where: { userId: session.user.id },
  });

  const storeData = store
    ? {
        ...store,
        description: store.description ?? undefined,
        logoUrl: store.logoUrl ?? undefined,
      }
    : undefined;

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
      <div className='mb-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
          Pengaturan Toko
        </h1>
        <p className='mt-2 text-sm sm:text-base text-gray-500'>
          Atur identitas bisnis Anda yang akan dilihat oleh pelanggan.
        </p>
      </div>

      <div className='bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200'>
        {/* Panggil formnya di sini, dan kirimkan data toko jika sudah ada */}
        <StoreForm initialData={storeData} />
      </div>
    </div>
  );
}
