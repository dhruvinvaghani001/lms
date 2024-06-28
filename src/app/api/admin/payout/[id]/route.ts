import { db } from "@/lib/db";
import isAdmin from "@/lib/isAdmin";
import { auth } from "@clerk/nextjs/server";
import { Status } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated user" },
        { status: 401 }
      );
    }

    if (!isAdmin(userId)) {
      return NextResponse.json(
        { message: "Unauthorised user" },
        { status: 401 }
      );
    }

    const { amount, bank, contact } = await request.json();

    const payoutReqeust = await db.payoutRequest.findUnique({
      where: {
        id: params.id,
      },
    });

    if (
      payoutReqeust?.status === Status.Faild ||
      payoutReqeust?.status === Status.Success ||
      payoutReqeust?.razorpayPayoutId
    ) {
      return NextResponse.json(
        { message: "You can't modify it" },
        { status: 400 }
      );
    }

    const payoutData = {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
      amount: amount * 80 * 100,
      currency: "INR",
      mode: "NEFT",
      purpose: "payout",
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name: bank.name,
          ifsc: bank.ifsc,
          account_number: bank.accountNumber,
        },
        contact: {
          name: contact.name,
          email: contact.email,
          contact: contact.contact,
          type: "vendor",
          reference_id: "Acme Contact ID 12345",
        },
      },
      queue_if_low_balance: true,
    };
    const APIauth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID!}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    axios
      .post("https://api.razorpay.com/v1/payouts", payoutData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${APIauth}`,
        },
      })
      .then(async (response) => {
        const updatePayoutRequest = await db.payoutRequest.update({
          where: {
            id: params.id,
          },
          data: { razorpayPayoutId: response.data.id },
        });
      })
      .catch(async (error) => {
        console.error(
          "Error creating payout:",
          error.response ? error.response.data : error.message
        );
        const updatePayoutRequest = await db.payoutRequest.update({
          where: {
            id: params.id,
          },
          data: { status: Status.Faild },
        });
        return NextResponse.json({ message: "payout error!" }, { status: 500 });
      });

    return NextResponse.json({ message: "Status updated" }, { status: 200 });
  } catch (error) {
    console.log("error while payouting from admin side!", error);
    return NextResponse.json(
      { message: "Internal server Error" },
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   const { amount, accountNumber, ifsc, name, mode } = await request.json();

//   const payoutData = {
//     account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
//     amount: amount,
//     currency: "INR",
//     mode: "NEFT",
//     purpose: "payout",
//     fund_account: {
//       account_type: "bank_account",
//       bank_account: {
//         name: "Gaurav Kumar",
//         ifsc: "HDFC0001234",
//         account_number: "1121431121541121",
//       },
//       contact: {
//         name: "Gaurav Kumar",
//         email: "gaurav.kumar@example.com",
//         contact: "9876543210",
//         type: "vendor",
//         reference_id: "Acme Contact ID 12345",
//       },
//     },
//     queue_if_low_balance: true,
//     reference_id: "Acme Transaction ID 12345",
//     narration: "Acme Corp Fund Transfer",
//   };

//   const payout = await razorpay.payouts.create(payoutData);

//   try {
//     const payout = await razorpay.payouts.create(payoutData);
//     return new Response(JSON.stringify(payout), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: error.message }), {
//       status: 500,
//     });
//   }
// }
