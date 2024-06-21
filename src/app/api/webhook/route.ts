import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: `web hook error: ${err?.message}` },
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  console.log("session rom webhook:");
  console.log(session);

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json({ message: "Webhook Error:" }, { status: 400 });
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
        purchasePrice: Math.round(session?.amount_total! / 100),
        stripeTransactionId: session.payment_intent?.toString(),
      },
    });
  } else {
    return NextResponse.json(
      { message: "unhandled webHook event type!" },
      { status: 200 }
    );
  }

  return NextResponse.json({}, { status: 200 });
}
