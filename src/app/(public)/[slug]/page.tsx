import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PublicMenuClient from "./PublicMenuClient"; // Import file yang baru kita bikin

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

  // Catat Analytics
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

  // Filter kategori yang punya isi aja
  const activeCategories = store.categories.filter((c) => c.items.length > 0);

  // Lempar datanya ke Komponen Client biar bisa di-search & klik
  return (
    <PublicMenuClient
      store={{ ...store, themeConfig: store.themeConfig as ThemeConfig }}
      categories={activeCategories}
    />
  );
}
