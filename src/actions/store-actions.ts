"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOrUpdateStore(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Anda belum login!" };

  const name = formData.get("name") as string;
  const slugInput = formData.get("slug") as string;
  const description = formData.get("description") as string;

  if (!name || !slugInput) {
    return { error: "Nama dan URL Toko wajib diisi!" };
  }

  // Bikin Slug jadi huruf kecil dan tanpa spasi
  const slug = slugInput
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // 🚀 --- PERUBAHAN UTAMA DI SINI --- 🚀
  // Tangkap seluruh paket JSON dari frontend
  const themeConfigRaw = formData.get("themeConfig") as string;
  let themeConfig = {};

  if (themeConfigRaw) {
    try {
      // Terjemahin dari teks JSON ke Object JavaScript biar Prisma ngerti
      themeConfig = JSON.parse(themeConfigRaw);
    } catch (error) {
      console.error("Gagal membaca themeConfig:", error);
      return { error: "Format dekorasi toko tidak valid." };
    }
  } else {
    // Fallback/Jaga-jaga kalau data lamanya masih pake 'themeColor'
    const themeColor = (formData.get("themeColor") as string) || "#2563EB";
    themeConfig = { primaryColor: themeColor };
  }

  // Cek apakah slug udah dipakai toko lain
  const existingStore = await db.store.findUnique({ where: { slug } });
  const userStore = await db.store.findUnique({
    where: { userId: session.user.id },
  });

  if (existingStore && existingStore.id !== userStore?.id) {
    return { error: "URL Toko sudah digunakan oleh orang lain." };
  }

  // Update atau Buat Toko Baru
  if (userStore) {
    await db.store.update({
      where: { userId: session.user.id },
      // Masukin themeConfig yang udah lengkap (ada font, logo, dll)
      data: { name, slug, description, themeConfig },
    });
  } else {
    await db.store.create({
      data: {
        name,
        slug,
        description,
        themeConfig,
        userId: session.user.id,
      },
    });
  }

  // Refresh cache halaman biar perubahannya instan!
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/${slug}`);

  return { success: true };
}
