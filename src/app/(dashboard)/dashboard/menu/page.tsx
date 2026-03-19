import MenuActionButtons from "@/components/dashboard/MenuActionButtons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MenuDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const store = await db.store.findUnique({
    where: { userId: session.user.id },
    include: {
      menuItems: {
        include: { category: true },
        orderBy: { categoryId: "asc" },
      },
    },
  });

  if (!store) redirect("/dashboard/settings");

  const menus = store.menuItems;

  return (
    <div className='max-w-5xl mx-auto pb-12'>
      {/* Header Dashboard */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
        <div>
          <h1 className='text-2xl font-extrabold text-gray-900 tracking-tight'>
            Manajemen Menu
          </h1>
          <p className='text-gray-500 mt-1 text-sm'>
            Kelola daftar hidangan untuk etalase{" "}
            <span className='font-semibold text-gray-700'>{store.name}</span>.
          </p>
        </div>
        <Link
          href='/dashboard/menu/new'
          className='flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 hover:shadow-lg transform active:scale-95 transition-all'
        >
          <span className='text-lg leading-none'>+</span> Tambah Menu
        </Link>
      </div>

      {menus.length === 0 ? (
        // Empty State (Tampilan jika belum ada menu)
        <div className='bg-white p-16 text-center rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center'>
          <div className='w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6'>
            <svg
              className='w-12 h-12'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>
            Etalase Masih Kosong
          </h3>
          <p className='text-gray-500 mb-6 max-w-sm'>
            Mulai tambahkan hidangan terbaik Anda agar pelanggan bisa melihatnya
            saat memindai QR code.
          </p>
          <Link
            href='/dashboard/menu/new'
            className='text-blue-600 font-semibold hover:text-blue-700 bg-blue-50 px-6 py-2 rounded-full transition-colors'
          >
            Buat menu pertama
          </Link>
        </div>
      ) : (
        // List Menu Modern
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold'>
                  <th className='p-5'>Menu Item</th>
                  <th className='p-5'>Kategori</th>
                  <th className='p-5'>Harga</th>
                  <th className='p-5 text-center'>Status</th>
                  <th className='p-5 text-right'>Aksi</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {menus.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-gray-50/80 transition-colors group'
                  >
                    {/* Kolom Gambar & Nama */}
                    <td className='p-5'>
                      <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200'>
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80"
                            }
                            alt={item.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='font-bold text-gray-900 group-hover:text-blue-600 transition-colors'>
                            {item.name}
                          </p>
                          {item.description && (
                            <p className='text-xs text-gray-500 mt-1 line-clamp-1 max-w-[200px]'>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kolom Kategori (Badge) */}
                    <td className='p-5'>
                      <span className='inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100'>
                        {item.category.name}
                      </span>
                    </td>

                    {/* Kolom Harga */}
                    <td className='p-5 font-semibold text-gray-900'>
                      Rp {item.price.toLocaleString("id-ID")}
                    </td>

                    {/* Kolom Status Ketersediaan */}
                    <td className='p-5 text-center'>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                        {item.isAvailable ? "Tersedia" : "Habis"}
                      </span>
                    </td>

                    {/* Kolom Aksi */}
                    {/* Kolom Aksi */}
                    <td className='p-5 text-right'>
                      <MenuActionButtons menuId={item.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
