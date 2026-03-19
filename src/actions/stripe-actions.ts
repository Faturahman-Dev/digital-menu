"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function createCheckoutSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Anda belum login!" };

  let checkoutUrl = ""; // Buat variabel penampung URL di luar try-catch

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "idr",
            recurring: { interval: "month" },
            product_data: {
              name: "MenuSaaS PRO",
              description:
                "Menu tak terbatas, kustomisasi tema, dan analytics.",
            },
            unit_amount: 49000,
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/dashboard?success=true`,
      cancel_url: `http://localhost:3000/dashboard/billing`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
      },
    });

    // Simpan URL-nya saja, JANGAN panggil redirect() di sini
    if (checkoutSession.url) {
      checkoutUrl = checkoutSession.url;
    }
  } catch (error) {
    console.error("Gagal membuat sesi Stripe:", error);
    return { error: "Terjadi kesalahan saat memproses pembayaran." };
  }

  // Panggil redirect() di LUAR blok try...catch!
  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}
