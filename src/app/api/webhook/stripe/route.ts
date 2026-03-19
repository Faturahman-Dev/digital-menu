import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  // Ambil data mentah dari Stripe
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    // Verifikasi bahwa ini Beneran dari Stripe, bukan dari hacker
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!, // Rahasia webhook kita
    );
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Ambil data transaksi
  const session = event.data.object as Stripe.Checkout.Session;

  // JIKA PEMBAYARAN SUKSES!
  if (event.type === "checkout.session.completed") {
    // Ambil ID User yang tadi kita titipkan di stripe-actions.ts
    const userId = session.metadata?.userId;

    if (userId) {
      // 🚀 UPDATE DATABASE: Ubah status user jadi PRO!
      await db.user.update({
        where: { id: userId },
        data: { plan: "PRO" },
      });
      console.log(`YEAY! User ${userId} berhasil di-upgrade ke PRO!`);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
