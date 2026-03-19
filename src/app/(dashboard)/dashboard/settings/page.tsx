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
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Pengaturan Toko</h1>
        <p className='text-gray-600 mt-1'>
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
