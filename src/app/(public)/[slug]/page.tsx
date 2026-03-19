import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PublicMenuProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicMenuPage({ params }: PublicMenuProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const store = await db.store.findUnique({
    where: { slug: slug },
    include: {
      categories: {
        include: {
          items: { where: { isAvailable: true } },
        },
      },
    },
  });

  if (!store) notFound();

  try {
    await db.analytics.create({
      data: {
        storeId: store.id,
        views: 1,
      },
    });
  } catch (error) {
    console.error("Gagal mencatat analytics:", error);
  }
  // -------------------------------------------------------

  const activeCategories = store.categories.filter((c) => c.items.length > 0);

  const theme = store.themeConfig as { primaryColor?: string } | null;
  const primaryColor = theme?.primaryColor || "#2563EB"; // Default ke biru kalau belum seting

  // Gambar default jika toko tidak punya logo/banner
  const defaultBanner =
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80";

  return (
    <div className='min-h-screen bg-[#f8f9fa] pb-24 font-sans'>
      {/* 1. Header Hero Section (Lebih Megah) */}
      <div className='relative h-56 sm:h-72 w-full bg-gray-900'>
        <img
          src={store.logoUrl || defaultBanner}
          alt={store.name}
          className='w-full h-full object-cover opacity-60'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />

        <div className='absolute bottom-0 left-0 p-6 sm:p-8 w-full'>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md'>
            {store.name}
          </h1>
          {store.description && (
            <p className='mt-2 text-gray-200 text-sm sm:text-base max-w-xl line-clamp-2 drop-shadow'>
              {store.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. Daftar Kategori & Menu */}
      <main className='max-w-3xl mx-auto mt-8 px-4 sm:px-6 space-y-10'>
        {activeCategories.length === 0 ? (
          <div className='bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100'>
            <p className='text-gray-500'>
              Menu sedang disiapkan oleh pemilik toko. 👩‍🍳
            </p>
          </div>
        ) : (
          activeCategories.map((category) => (
            <section
              key={category.id}
              className='scroll-mt-24'
            >
              {/* Judul Kategori dengan styling modern */}
              <div className='flex items-center gap-4 mb-5'>
                <h2 className='text-2xl font-bold text-gray-900 tracking-tight'>
                  {category.name}
                </h2>
                <div className='h-px bg-gray-200 flex-1 mt-1'></div>
              </div>

              {/* Grid Menu Item (Layout Horizontal/Card) */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className='group flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300'
                  >
                    {/* Gambar Thumbnail (Kiri) */}
                    <div className='w-32 sm:w-40 h-auto flex-shrink-0 bg-gray-100 relative overflow-hidden'>
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
                        }
                        alt={item.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                    </div>

                    {/* Detail Menu (Kanan) */}
                    <div className='p-4 flex flex-col justify-between flex-1'>
                      <div>
                        <h3 className='font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors'>
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className='text-sm text-gray-500 mt-1.5 line-clamp-2 leading-snug'>
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className='mt-4 flex items-center justify-between'>
                        {/* Teks Harga pakai warna tema */}
                        <span
                          className='font-extrabold text-lg'
                          style={{ color: primaryColor }}
                        >
                          Rp {item.price.toLocaleString("id-ID")}
                        </span>

                        {/* Tombol "+" pakai warna tema */}
                        <button
                          className='w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95'
                          style={{ backgroundColor: primaryColor }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer yang lebih elegan */}
      <footer className='mt-16 pb-8 text-center'>
        <div className='inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-xs text-gray-500 font-medium'>
          Powered by <span className='font-bold text-gray-900'>MenuSaaS</span>
        </div>
      </footer>
    </div>
  );
}
