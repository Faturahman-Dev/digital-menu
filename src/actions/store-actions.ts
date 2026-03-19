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

  // Tangkap warna, kalau kosong kita kasih default biru
  const themeColor = (formData.get("themeColor") as string) || "#2563EB";

  if (!name || !slugInput) {
    return { error: "Nama dan URL Toko wajib diisi!" };
  }

  const slug = slugInput
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const existingStore = await db.store.findUnique({ where: { slug } });
  const userStore = await db.store.findUnique({
    where: { userId: session.user.id },
  });

  if (existingStore && existingStore.id !== userStore?.id) {
    return { error: "URL Toko sudah digunakan oleh orang lain." };
  }

  // Bungkus warna sebagai JSON Object yang disukai Prisma
  const themeConfig = { primaryColor: themeColor };

  if (userStore) {
    await db.store.update({
      where: { userId: session.user.id },
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

  // Refresh semua jalur yang berkaitan dengan toko ini
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath(`/${slug}`); // Refresh halaman etalase publik

  return { success: true };
}
