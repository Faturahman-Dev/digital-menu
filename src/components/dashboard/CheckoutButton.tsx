"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/actions/stripe-actions";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    // Panggil aksi ke server untuk bikin sesi Stripe
    const result = await createCheckoutSession();

    if (result?.error) {
      alert(result.error);
      setLoading(false);
    } else if (result && "url" in result && typeof result.url === "string") {
      // Kalau sukses dapet URL, arahkan browser ke halaman Stripe
      window.location.href = result.url;
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className='w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 hover:shadow-lg transition-all transform active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed'
    >
      {loading ? "Memproses Pembayaran..." : "Upgrade ke PRO Sekarang"}
    </button>
  );
}
