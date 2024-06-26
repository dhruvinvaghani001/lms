import { db } from "@/lib/db";
import isAdmin from "@/lib/isAdmin";
import { auth } from "@clerk/nextjs/server";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";

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

    const reqBody = await request.json();

    const payoutReqeust = await db.payoutRequest.findUnique({
      where: {
        id: params.id,
      },
    });

    if (
      payoutReqeust?.status === Status.Faild ||
      payoutReqeust?.status === Status.Success
    ) {
      return NextResponse.json(
        { message: "You can't modify it" },
        { status: 400 }
      );
    }

    const updatePayoutRequest = await db.payoutRequest.update({
      where: {
        id: params.id,
      },
      data: reqBody,
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
