import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User" },
        { status: 401 }
      );
    }
    const reqBody = await request.json();

    if (reqBody.amount == 0) {
      return NextResponse.json(
        { message: "Wallet is Empty!" },
        { status: 400 }
      );
    }

    const [contact, bank] = await Promise.all([
      db.contactDetail.findUnique({
        where: {
          userId,
        },
      }),
      db.bankDetail.findUnique({
        where: {
          userId,
        },
      }),
    ]);

    if (!contact || !bank) {
      return NextResponse.json(
        { message: "Submit your details!" },
        { status: 404 }
      );
    }

    const pendingPaymentRequest = await db.payoutRequest.findMany({
      where: {
        userId,
        status: "Pending",
      },
    });

    if (pendingPaymentRequest.length > 0) {
      return NextResponse.json(
        { message: "You have alredy one pending request !" },
        { status: 400 }
      );
    }

    const payoutRequest = await db.payoutRequest.create({
      data: {
        amount: reqBody.amount,
        userId: userId,
        status: "Pending",
      },
    });
    if (!payoutRequest) {
      return NextResponse.json(
        { message: "internal server error!" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Payout request send to admin!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("payout requets error", error);
    return NextResponse.json(
      { message: "internal server errror!" },
      { status: 500 }
    );
  }
}
