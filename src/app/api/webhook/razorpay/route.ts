import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const body = await request.text();
  const receivedSignature = request.headers.get("x-razorpay-signature");

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    Razorpay.validateWebhookSignature(body, receivedSignature!, webhookSecret);
    const PayoutBody = JSON.parse(body);
    const event = JSON.parse(body).event;
    const payoutId: string = PayoutBody.payload.payout.id;

    switch (event) {
      case "payout.failed":
        console.log("payout failed!");
        const payoutRequest1 = await db.payoutRequest.findFirst({
          where: {
            razorpayPayoutId: payoutId,
          },
        });
        const updatePayoutRequest1 = await db.payoutRequest.update({
          where: {
            id: payoutRequest1?.id!,
          },
          data: {
            status: Status.Faild,
          },
        });
        break;
      case "payout.processed":
        // Handle payout processed
        console.log("payout processes");
        const payoutRequest = await db.payoutRequest.findFirst({
          where: {
            razorpayPayoutId: payoutId,
          },
        });
        console.log(payoutRequest);
        const updatePayoutRequest = await db.payoutRequest.update({
          where: {
            id: payoutRequest?.id!,
          },
          data: {
            status: Status.Success,
          },
        });
        console.log(updatePayoutRequest);
        break;
    }

    return new Response(JSON.stringify({ status: "success" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Invalid signature" }), {
      status: 400,
    });
  }
}
