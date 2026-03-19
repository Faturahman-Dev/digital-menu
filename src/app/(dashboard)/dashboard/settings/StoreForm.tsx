"use client";

import { useState } from "react";
import { createOrUpdateStore } from "@/actions/store-actions";
import { useRouter } from "next/navigation";

const PRESET_COLORS = [
  "#2563EB",
  "#E11D48",
  "#16A34A",
  "#D97706",
  "#7C3AED",
  "#475569",
  "#000000",
];

export default function StoreForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Membaca warna dari database dengan sangat hati-hati
  let defaultColor = PRESET_COLORS[0];
  if (initialData?.themeConfig && typeof initialData.themeConfig === "object") {
    defaultColor = initialData.themeConfig.primaryColor || PRESET_COLORS[0];
  }

  const [selectedColor, setSelectedColor] = useState(defaultColor);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Paksa masukkan warna ke dalam form sebelum dikirim ke server
    formData.set("themeColor", selectedColor);

    const result = await createOrUpdateStore(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form
      action={handleSubmit}
      className='space-y-6'
    >
      {error && (
        <div className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md'>
          {error}
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Nama Toko / Restoran
        </label>
        <input
          type='text'
          name='name'
          defaultValue={initialData?.name || ""}
          required
          className='w-full px-4 py-2 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          URL Menu Digital Anda
        </label>
        <div className='flex mt-1 shadow-sm rounded-xl overflow-hidden'>
          <span className='inline-flex items-center px-4 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 font-medium text-sm'>
            menu.com/
          </span>
          <input
            type='text'
            name='slug'
            defaultValue={initialData?.slug || ""}
            required
            className='flex-1 w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Deskripsi Singkat
        </label>
        <textarea
          name='description'
          defaultValue={initialData?.description || ""}
          rows={3}
          className='w-full px-4 py-2 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all'
        />
      </div>

      {/* PILIHAN WARNA */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-3'>
          Warna Utama Tema Toko
        </label>
        <div className='flex flex-wrap gap-3'>
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type='button'
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                selectedColor === color
                  ? "ring-4 ring-offset-2 ring-gray-400 scale-110 shadow-md"
                  : "border border-gray-200"
              }`}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && (
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={3}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full px-4 py-3 text-white bg-gray-900 rounded-xl font-bold hover:bg-gray-800 transition disabled:bg-gray-400'
      >
        {loading ? "Menyimpan Data..." : "Simpan Profil Toko"}
      </button>
    </form>
  );
}
