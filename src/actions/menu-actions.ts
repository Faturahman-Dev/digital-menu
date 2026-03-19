"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMenu(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Anda belum login!" };

  // 1. Cari toko milik user ini
  const store = await db.store.findUnique({
    where: { userId: session.user.id },
  });

  if (!store) return { error: "Silakan buat profil toko terlebih dahulu!" };

  // 2. Cek Limit SaaS (Akun FREE maksimal 10 menu)
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  const totalMenus = await db.menuItem.count({ where: { storeId: store.id } });

  if (user?.plan === "FREE" && totalMenus >= 10) {
    return {
      error:
        "Limit paket FREE tercapai (Maks 10 Menu). Silakan upgrade ke PRO!",
    };
  }

  // 3. Ambil data dari form
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const categoryName = (formData.get("category") as string) || "Umum";
  const image = formData.get("image") as string; // TANGKAP URL GAMBAR

  if (!name || isNaN(price)) {
    return { error: "Nama menu dan harga wajib diisi dengan benar!" };
  }

  // 4. Cari atau buat Kategori (Misal: "Makanan", "Minuman")
  let category = await db.category.findFirst({
    where: { name: categoryName, storeId: store.id },
  });

  if (!category) {
    category = await db.category.create({
      data: { name: categoryName, storeId: store.id },
    });
  }

  // 5. Simpan Menu Baru ke Database
  await db.menuItem.create({
    data: {
      name,
      price,
      description,
      categoryId: category.id,
      storeId: store.id,
      image: image || null, // SIMPAN GAMBAR JIKA ADA
    },
  });

  // 6. Refresh halaman menu
  revalidatePath("/dashboard/menu");

  return { success: true };
}

// Fungsi untuk Menghapus Menu
export async function deleteMenu(menuId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Anda belum login!" };

  // 1. Pastikan menu ini benar-benar milik toko user yang sedang login
  const menu = await db.menuItem.findUnique({
    where: { id: menuId },
    include: { store: true },
  });

  if (!menu || menu.store.userId !== session.user.id) {
    return { error: "Akses ditolak!" };
  }

  // 2. Hapus dari database
  await db.menuItem.delete({
    where: { id: menuId },
  });

  revalidatePath("/dashboard/menu");
  revalidatePath(`/${menu.store.slug}`); // Refresh juga halaman publiknya
  return { success: true };
}

// Fungsi untuk Menyimpan Editan Menu
export async function updateMenu(menuId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Anda belum login!" };

  const menu = await db.menuItem.findUnique({
    where: { id: menuId },
    include: { store: true },
  });

  if (!menu || menu.store.userId !== session.user.id) {
    return { error: "Akses ditolak!" };
  }

  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  if (!name || isNaN(price)) return { error: "Data tidak valid!" };

  await db.menuItem.update({
    where: { id: menuId },
    data: { name, price, description, image: image || null },
  });

  revalidatePath("/dashboard/menu");
  return { success: true };
}
