import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditMenuForm from "./EditMenuForm"; // Kita akan buat file ini setelah ini

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const menuId = resolvedParams.id;

  // Ambil data menu yang mau diedit
  const menu = await db.menuItem.findUnique({
    where: { id: menuId },
    include: { category: true },
  });

  if (!menu) notFound();

  const transformedMenu = {
    ...menu,
    description: menu.description ?? undefined,
    image: menu.image ?? undefined,
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Edit Menu</h1>
        <Link
          href='/dashboard/menu'
          className='text-gray-500 hover:text-gray-900'
        >
          Batal
        </Link>
      </div>

      <div className='bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200'>
        <EditMenuForm menu={transformedMenu} />
      </div>
    </div>
  );
}
