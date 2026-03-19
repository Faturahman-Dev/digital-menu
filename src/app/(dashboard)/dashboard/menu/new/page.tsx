"use client";

import { useState } from "react";
import { createMenu } from "@/actions/menu-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Import komponen UploadThing
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import "@uploadthing/react/styles.css"; // CSS Bawaan UploadThing

export default function NewMenuPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(""); // State untuk menyimpan URL gambar
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    // Sisipkan URL gambar yang sudah di-upload ke dalam form data
    if (imageUrl) {
      formData.set("image", imageUrl);
    }

    const result = await createMenu(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/menu");
      router.refresh();
    }
  }

  return (
    <div className='max-w-2xl mx-auto pb-12'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
          Tambah Menu Baru
        </h1>
        <Link
          href='/dashboard/menu'
          className='text-gray-500 hover:text-gray-900 font-medium'
        >
          Batal
        </Link>
      </div>

      <div className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100'>
        <form
          action={handleSubmit}
          className='space-y-6'
        >
          {error && (
            <div className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg font-medium'>
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Nama Menu
            </label>
            <input
              type='text'
              name='name'
              required
              placeholder='Misal: Nasi Goreng Spesial'
              className='w-full px-4 py-2 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Harga (Rp)
              </label>
              <input
                type='number'
                name='price'
                required
                min='0'
                placeholder='25000'
                className='w-full px-4 py-2 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Kategori
              </label>
              <input
                type='text'
                name='category'
                required
                placeholder='Misal: Makanan Utama'
                className='w-full px-4 py-2 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Deskripsi
            </label>
            <textarea
              name='description'
              rows={3}
              placeholder='Nasi goreng dengan telur, ayam, dan sosis...'
              className='w-full px-4 py-2 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
            />
          </div>

          {/* AREA UPLOAD GAMBAR */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Foto Menu (Opsional)
            </label>

            {imageUrl ? (
              <div className='relative w-full h-48 rounded-xl overflow-hidden border border-gray-200'>
                <img
                  src={imageUrl}
                  alt='Preview'
                  className='w-full h-full object-cover'
                />
                <button
                  type='button'
                  onClick={() => setImageUrl("")}
                  className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg text-xs font-bold hover:bg-red-600 transition'
                >
                  Hapus Foto
                </button>
              </div>
            ) : (
              <div className='border border-gray-200 rounded-xl overflow-hidden'>
                <UploadDropzone<OurFileRouter>
                  endpoint='imageUploader'
                  onClientUploadComplete={(res) => {
                    // res[0].url adalah link gambar yang berhasil di-upload ke server
                    setImageUrl(res[0].url);
                    alert("Gambar berhasil di-upload!");
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-blue-600 text-white px-4 py-2 rounded-lg font-medium",
                    container:
                      "p-8 border-dashed border-2 border-gray-300 bg-gray-50",
                    label:
                      "text-gray-600 hover:text-blue-600 transition-colors",
                  }}
                />
              </div>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-3 text-white bg-gray-900 rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg transform active:scale-95 transition-all disabled:bg-gray-400'
          >
            {loading ? "Menyimpan Menu..." : "Simpan Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}
