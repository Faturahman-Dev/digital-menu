"use client";

import { useState } from "react";
import { createOrUpdateStore } from "@/actions/store-actions";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const PRESET_COLORS = [
  "#2563EB",
  "#E11D48",
  "#16A34A",
  "#D97706",
  "#7C3AED",
  "#475569",
  "#000000",
];
const FONTS = [
  { id: "font-sans", name: "Modern (Sans)", desc: "Bersih & Profesional" },
  { id: "font-serif", name: "Klasik (Serif)", desc: "Elegan & Mewah" },
  { id: "font-mono", name: "Retro (Mono)", desc: "Unik & Kekinian" },
];
const CARD_STYLES = [
  { id: "rounded-none", name: "Kotak Tegas" },
  { id: "rounded-xl", name: "Sedang" },
  { id: "rounded-3xl", name: "Sangat Bulat" },
];

export default function StoreForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "design">("info");
  const router = useRouter();

  // Parsing themeConfig dengan aman
  let theme = {
    primaryColor: PRESET_COLORS[0],
    font: "font-sans",
    cardStyle: "rounded-xl",
    logoUrl: "",
    bannerUrl: "",
  };
  if (initialData?.themeConfig) {
    theme =
      typeof initialData.themeConfig === "string"
        ? JSON.parse(initialData.themeConfig)
        : initialData.themeConfig;
  }

  // State untuk Dekorasi Toko
  const [selectedColor, setSelectedColor] = useState(
    theme.primaryColor || PRESET_COLORS[0],
  );
  const [selectedFont, setSelectedFont] = useState(theme.font || "font-sans");
  const [selectedCardStyle, setSelectedCardStyle] = useState(
    theme.cardStyle || "rounded-xl",
  );
  const [logoUrl, setLogoUrl] = useState(
    theme.logoUrl || initialData?.logoUrl || "",
  );
  const [bannerUrl, setBannerUrl] = useState(theme.bannerUrl || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    Swal.fire({
      title: "Menyimpan Dekorasi...",
      text: "Sedang memperbarui etalase tokomu.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // Bungkus SEMUA pengaturan visual ke dalam JSON themeConfig
    const themeConfigData = {
      primaryColor: selectedColor,
      font: selectedFont,
      cardStyle: selectedCardStyle,
      logoUrl: logoUrl,
      bannerUrl: bannerUrl,
    };
    formData.set("themeConfig", JSON.stringify(themeConfigData));

    const result = await createOrUpdateStore(formData);

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: result.error,
        confirmButtonColor: selectedColor,
      });
      setError(result.error);
      setLoading(false);
    } else {
      const newSlug = formData.get("slug") as string;
      Swal.fire({
        icon: "success",
        title: "Toko Diperbarui!",
        text: "Dekorasi etalase berhasil disimpan.",
        timer: 7000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: "Ke Dashboard",
        confirmButtonColor: selectedColor,
        showDenyButton: true,
        denyButtonText: "Lihat Toko 🌐",
        denyButtonColor: "#475569",
      }).then((result) => {
        setLoading(false);
        if (result.isDenied) window.open(`/${newSlug}`, "_blank");
        router.push("/dashboard");
        router.refresh();
      });
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
      {/* TABS HEADER */}
      <div className='flex border-b border-gray-100'>
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === "info" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"}`}
        >
          📝 Informasi Dasar
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === "design" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:bg-gray-50"}`}
        >
          🎨 Tampilan & Dekorasi
        </button>
      </div>

      <form
        action={handleSubmit}
        className='p-6 space-y-8'
      >
        {error && (
          <div className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg'>
            {error}
          </div>
        )}

        {/* TAB 1: INFORMASI DASAR */}
        <div
          className={
            activeTab === "info"
              ? "space-y-6 block animate-in fade-in slide-in-from-left-4"
              : "hidden"
          }
        >
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-1'>
              Nama Toko
            </label>
            <input
              type='text'
              name='name'
              defaultValue={initialData?.name || ""}
              required
              className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-1'>
              URL Menu Digital
            </label>
            <div className='flex shadow-sm rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500'>
              <span className='px-4 py-3 bg-gray-50 text-gray-500 border-r border-gray-200 font-medium text-sm'>
                menusaas.com/
              </span>
              <input
                type='text'
                name='slug'
                defaultValue={initialData?.slug || ""}
                required
                className='flex-1 w-full px-4 py-3 outline-none'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-1'>
              Deskripsi
            </label>
            <textarea
              name='description'
              defaultValue={initialData?.description || ""}
              rows={3}
              className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
        </div>

        {/* TAB 2: DEKORASI VISUAL */}
        <div
          className={
            activeTab === "design"
              ? "space-y-8 block animate-in fade-in slide-in-from-right-4"
              : "hidden"
          }
        >
          {/* BANNER & LOGO */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <label className='block text-sm font-bold text-gray-700'>
                Banner Toko (Link Gambar)
              </label>
              <div className='h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden relative group'>
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    className='w-full h-full object-cover opacity-80'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium'>
                    Preview Banner
                  </div>
                )}
              </div>
              <input
                type='url'
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder='https://contoh.com/banner.jpg'
                className='w-full px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500'
              />
            </div>

            <div className='space-y-3'>
              <label className='block text-sm font-bold text-gray-700'>
                Logo Toko (Link Gambar)
              </label>
              <div className='h-24 flex items-center'>
                <div className='w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 shadow-sm'>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-[10px] text-gray-400'>
                      Logo
                    </div>
                  )}
                </div>
                <input
                  type='url'
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder='https://contoh.com/logo.png'
                  className='ml-4 flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500'
                />
              </div>
            </div>
          </div>

          <hr className='border-gray-100' />

          {/* FONT & CARD STYLE */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-3'>
                Gaya Tulisan (Font)
              </label>
              <div className='space-y-2'>
                {FONTS.map((f) => (
                  <label
                    key={f.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedFont === f.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className='flex items-center gap-3'>
                      <input
                        type='radio'
                        name='font'
                        checked={selectedFont === f.id}
                        onChange={() => setSelectedFont(f.id)}
                        className='w-4 h-4 text-blue-600'
                      />
                      <div>
                        <p className={`font-bold text-gray-900 ${f.id}`}>
                          {f.name}
                        </p>
                        <p className='text-xs text-gray-500'>{f.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-3'>
                Bentuk Kartu Menu
              </label>
              <div className='space-y-2'>
                {CARD_STYLES.map((style) => (
                  <label
                    key={style.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedCardStyle === style.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <input
                      type='radio'
                      name='cardStyle'
                      checked={selectedCardStyle === style.id}
                      onChange={() => setSelectedCardStyle(style.id)}
                      className='w-4 h-4 text-blue-600'
                    />
                    <span className='text-sm font-bold text-gray-700'>
                      {style.name}
                    </span>
                    {/* Preview Kotak */}
                    <div
                      className={`ml-auto w-12 h-8 bg-white border-2 border-gray-300 ${style.id}`}
                    ></div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <hr className='border-gray-100' />

          {/* WARNA UTAMA */}
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-3'>
              Warna Utama (Tombol & Aksen)
            </label>
            <div className='flex flex-wrap gap-3'>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type='button'
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${selectedColor === color ? "ring-4 ring-offset-2 ring-gray-400 scale-110 shadow-md" : "border border-gray-200"}`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <svg
                      className='w-6 h-6 text-white'
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
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full px-4 py-4 text-white rounded-xl font-bold transition disabled:bg-gray-400 hover:shadow-lg active:scale-95 text-lg'
          style={{ backgroundColor: selectedColor }}
        >
          {loading ? "Menyimpan Data..." : "Simpan Dekorasi Toko"}
        </button>
      </form>
    </div>
  );
}
