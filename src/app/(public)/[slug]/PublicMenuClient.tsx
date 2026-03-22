"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

// --- KTP TypeScript ---
interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

interface StoreData {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  phone?: string | null; // Nomor WA Toko
  themeConfig?: any; // Pake any biar bebas nampung font, cardStyle, dll
  askTableNumber?: boolean;
}

export default function PublicMenuClient({
  store,
  categories,
}: {
  store: StoreData;
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form">("cart");

  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<"dine_in" | "takeaway">("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");

  const {
    items: cartItems,
    addToCart,
    updateQuantity,
    clearCart,
  } = useCartStore();

  // 🎨 --- KAMUS TAILWIND (Wajib biar CSS gak dihapus otomatis) --- 🎨
  const FONT_MAP: Record<string, string> = {
    "font-sans": "font-sans",
    "font-serif": "font-serif",
    "font-mono": "font-mono",
  };

  const CARD_MAP: Record<string, string> = {
    "rounded-none": "rounded-none",
    "rounded-xl": "rounded-xl",
    "rounded-3xl": "rounded-3xl",
  };

  // 🎨 --- BONGKAR JSON DEKORASI TOKO --- 🎨
  let theme = store.themeConfig || {};
  if (typeof theme === "string") {
    try {
      theme = JSON.parse(theme);
    } catch (e) {
      theme = {};
    }
  }

  const primaryColor = theme.primaryColor || "#2563EB";
  const fontStyle = FONT_MAP[theme.font] || "font-sans";
  const cardStyle = CARD_MAP[theme.cardStyle] || "rounded-2xl"; // default rounded-2xl
  const logo = theme.logoUrl || store.logoUrl;
  const banner =
    theme.bannerUrl ||
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80";

  const isTableFeatureEnabled = store.askTableNumber !== false;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const formatRp = (angka: number) => `Rp ${angka.toLocaleString("id-ID")}`;

  const filteredCategories = categories
    .map((cat) => {
      const filteredItems = cat.items.filter((item: MenuItem) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
      return { ...cat, items: filteredItems };
    })
    .filter((cat) => {
      return (
        (selectedCategory === "all" || cat.id === selectedCategory) &&
        cat.items.length > 0
      );
    });

  const totalMenu = filteredCategories.reduce(
    (acc, cat) => acc + cat.items.length,
    0,
  );

  // --- LOGIKA KIRIM KE WHATSAPP ---
  const handleSendWhatsApp = () => {
    if (!customerName.trim()) {
      alert("Tolong isi nama kamu dulu ya! 🙏");
      return;
    }

    const storePhone = store.phone || "628817431760";
    let message = `Halo *${store.name}*, saya mau pesan:\n\n`;

    cartItems.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} (${formatRp(item.price * item.quantity)})\n`;
    });

    message += `\n*Total Tagihan: ${formatRp(totalPrice)}*\n`;
    message += `\n*Detail Pemesan:*\n`;
    message += `Nama: ${customerName}\n`;
    message += `Tipe: ${orderType === "dine_in" ? "Makan di Tempat 🍽️" : "Bawa Pulang 🛍️"}\n`;

    if (isTableFeatureEnabled && orderType === "dine_in" && tableNumber) {
      message += `No. Meja: ${tableNumber}\n`;
    }

    if (notes) {
      message += `Catatan: ${notes}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setIsCartOpen(false);
    clearCart();
    setCheckoutStep("cart");
  };

  return (
    // 🎨 --- MASUKIN VARIABEL FONT DINAMIS KE CONTAINER PALING LUAR --- 🎨
    <div className={`min-h-screen bg-[#f8f9fa] pb-32 ${fontStyle}`}>
      {/* 🖼️ --- HEADER HERO SECTION (Banner Dinamis) --- 🖼️ */}
      <div className='relative h-56 sm:h-72 w-full bg-gray-900'>
        <img
          src={banner}
          alt={store.name}
          className='w-full h-full object-cover opacity-60'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

        {/* Kontainer Nama & Logo biar cakep */}
        <div className='absolute bottom-0 left-0 p-6 sm:p-8 w-full flex items-end gap-5'>
          {logo && (
            <img
              src={logo}
              alt='Logo Toko'
              className='w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-xl object-cover bg-white flex-shrink-0'
            />
          )}
          <div className='flex-1'>
            <h1 className='text-3xl font-extrabold text-white drop-shadow-md'>
              {store.name}
            </h1>
            {store.description && (
              <p className='mt-2 text-gray-200 text-sm line-clamp-2 drop-shadow-sm'>
                {store.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <main className='max-w-3xl mx-auto px-4 sm:px-6 -mt-6 relative z-10'>
        {/* Search Bar */}
        <div className='relative mb-6 shadow-sm mt-4'>
          <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
            <svg
              className='w-5 h-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Cari menu favoritmu...'
            className='w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:outline-none'
          />
        </div>

        {/* DAFTAR MENU */}
        <div className='space-y-10'>
          {filteredCategories.map((category) => (
            <section key={category.id}>
              <h2 className='text-xl font-bold text-gray-900 mb-4 border-b pb-2'>
                {category.name}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {category.items.map((item: MenuItem) => {
                  const cartItem = cartItems.find((i) => i.id === item.id);
                  return (
                    // 🎨 --- BENTUK KARTU (KOTAK/BULAT) DI-INJECT KE SINI --- 🎨
                    <div
                      key={item.id}
                      className={`flex bg-white ${cardStyle} overflow-hidden border border-gray-100 shadow-sm transition-shadow hover:shadow-md`}
                    >
                      <div className='w-28 flex-shrink-0 bg-gray-100 relative'>
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
                          }
                          alt={item.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div className='p-4 flex flex-col justify-between flex-1'>
                        <div>
                          <h3 className='font-bold text-gray-900 text-base'>
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className='mt-3 flex items-center justify-between'>
                          <span
                            className='font-extrabold'
                            style={{ color: primaryColor }}
                          >
                            {formatRp(item.price)}
                          </span>

                          {cartItem ? (
                            <div className='flex items-center gap-3 bg-gray-50 rounded-full border border-gray-200 p-1'>
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className='w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-full bg-white shadow-sm'
                              >
                                -
                              </button>
                              <span className='font-bold text-sm w-4 text-center'>
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className='w-8 h-8 flex items-center justify-center font-bold text-white rounded-full transition-transform active:scale-95'
                                style={{ backgroundColor: primaryColor }}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                addToCart({
                                  id: item.id,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                })
                              }
                              className='w-8 h-8 rounded-full flex items-center justify-center font-bold text-white active:scale-95 transition-transform'
                              style={{ backgroundColor: primaryColor }}
                            >
                              +
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* --- TOMBOL MENGAMBANG KERANJANG BELANJA --- */}
      {totalItems > 0 && !isCartOpen && (
        <div className='fixed bottom-6 left-0 right-0 px-4 z-40 animate-bounce-short'>
          <div className='max-w-md mx-auto'>
            <button
              onClick={() => {
                setIsCartOpen(true);
                setCheckoutStep("cart");
              }}
              className='w-full flex items-center justify-between px-6 py-4 rounded-full shadow-2xl text-white font-bold transition-transform active:scale-95'
              style={{ backgroundColor: primaryColor }}
            >
              <div className='flex items-center gap-3'>
                <span className='bg-white/20 px-3 py-1 rounded-full text-sm'>
                  {totalItems} Item
                </span>
              </div>
              <span>Lihat Pesanan • {formatRp(totalPrice)}</span>
            </button>
          </div>
        </div>
      )}

      {/* --- POP-UP MODAL (KERANJANG & CHECKOUT) --- */}
      {isCartOpen && (
        <div className='fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity'>
          <div
            className='flex-1'
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className='bg-white rounded-t-3xl max-h-[90vh] flex flex-col max-w-2xl mx-auto w-full'>
            <div className='p-5 border-b border-gray-100 flex justify-between items-center'>
              {checkoutStep === "form" ? (
                <button
                  onClick={() => setCheckoutStep("cart")}
                  className='font-bold text-gray-500 hover:text-gray-900'
                >
                  ← Kembali
                </button>
              ) : (
                <h2 className='text-xl font-bold text-gray-900'>
                  Pesanan Anda
                </h2>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className='p-2 bg-gray-100 rounded-full text-gray-600 font-bold w-8 h-8 flex items-center justify-center'
              >
                ✕
              </button>
            </div>

            <div className='p-6 overflow-y-auto flex-1'>
              {/* STEP 1: LIHAT KERANJANG */}
              {checkoutStep === "cart" && (
                <div className='space-y-4'>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex justify-between items-center gap-4'
                    >
                      <div className='flex-1'>
                        <h4 className='font-bold text-gray-900 text-sm'>
                          {item.name}
                        </h4>
                        <p className='text-gray-500 text-xs mt-1'>
                          {formatRp(item.price)}
                        </p>
                      </div>
                      <div className='flex items-center gap-3 bg-gray-50 rounded-full border border-gray-200 px-1 py-1'>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className='w-7 h-7 flex items-center justify-center font-bold text-gray-600 bg-white rounded-full shadow-sm'
                        >
                          -
                        </button>
                        <span className='font-bold text-sm w-4 text-center'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className='w-7 h-7 flex items-center justify-center font-bold text-white rounded-full'
                          style={{ backgroundColor: primaryColor }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: FORM CHECKOUT */}
              {checkoutStep === "form" && (
                <div className='space-y-5'>
                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-1'>
                      Nama Pemesan *
                    </label>
                    <input
                      type='text'
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder='Misal: Budi'
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none'
                      style={{
                        borderColor: customerName.trim() ? "gray" : "red",
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-1'>
                      Tipe Pesanan
                    </label>
                    <div className='flex gap-3'>
                      <button
                        onClick={() => setOrderType("dine_in")}
                        className={`flex-1 py-3 rounded-xl font-bold border ${orderType === "dine_in" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}
                      >
                        Makan di Tempat
                      </button>
                      <button
                        onClick={() => setOrderType("takeaway")}
                        className={`flex-1 py-3 rounded-xl font-bold border ${orderType === "takeaway" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500"}`}
                      >
                        Bawa Pulang
                      </button>
                    </div>
                  </div>

                  {isTableFeatureEnabled && orderType === "dine_in" && (
                    <div>
                      <label className='block text-sm font-bold text-gray-700 mb-1'>
                        Nomor Meja
                      </label>
                      <input
                        type='text'
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder='Misal: 12'
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none'
                      />
                    </div>
                  )}

                  <div>
                    <label className='block text-sm font-bold text-gray-700 mb-1'>
                      Catatan Tambahan (Opsional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder='Misal: Esnya dipisah ya mas'
                      className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none'
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AREA BAWAH MODAL */}
            <div className='p-6 bg-gray-50 border-t border-gray-100 pb-10'>
              <div className='flex justify-between items-center mb-6'>
                <span className='text-gray-500 font-medium'>
                  Total Pembayaran
                </span>
                <span className='text-2xl font-black text-gray-900'>
                  {formatRp(totalPrice)}
                </span>
              </div>

              {checkoutStep === "cart" ? (
                <button
                  onClick={() => setCheckoutStep("form")}
                  className='w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform'
                  style={{ backgroundColor: primaryColor }}
                >
                  Lanjut Pesan
                </button>
              ) : (
                <button
                  onClick={handleSendWhatsApp}
                  className='w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2'
                  style={{ backgroundColor: "#25D366" }}
                >
                  Kirim ke WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
