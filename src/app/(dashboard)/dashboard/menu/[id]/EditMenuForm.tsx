"use client";

import { useState } from "react";
import { updateMenu } from "@/actions/menu-actions";
import { useRouter } from "next/navigation";

interface Menu {
  id: string;
  name: string;
  price: number;
  category: { name: string };
  description?: string;
  image?: string;
}

export default function EditMenuForm({ menu }: { menu: Menu }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updateMenu(menu.id, formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/menu");
      router.refresh();
    }
  }

  return (
    <form
      action={handleSubmit}
      className='space-y-6'
    >
      {error && (
        <div className='p-3 text-sm text-red-600 bg-red-50 rounded-md'>
          {error}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Nama Menu
        </label>
        <input
          type='text'
          name='name'
          defaultValue={menu.name}
          required
          className='w-full px-4 py-2 mt-1 border rounded-lg'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Harga (Rp)
          </label>
          <input
            type='number'
            name='price'
            defaultValue={menu.price}
            required
            className='w-full px-4 py-2 mt-1 border rounded-lg'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Kategori
          </label>
          <input
            type='text'
            name='category'
            defaultValue={menu.category.name}
            disabled
            className='w-full px-4 py-2 mt-1 border bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed'
            title='Kategori belum bisa diubah di sini'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Deskripsi
        </label>
        <textarea
          name='description'
          defaultValue={menu.description || ""}
          rows={3}
          className='w-full px-4 py-2 mt-1 border rounded-lg'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          URL Gambar (Opsional)
        </label>
        <input
          type='url'
          name='image'
          defaultValue={menu.image || ""}
          className='w-full px-4 py-2 mt-1 border rounded-lg'
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full px-4 py-3 text-white bg-gray-900 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:bg-gray-400'
      >
        {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
