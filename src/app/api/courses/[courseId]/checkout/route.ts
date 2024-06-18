import { db } from "@/lib/db";
// import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.emailAddresses?.[0]?.emailAddress || !user.id) {
      return NextResponse.json(
        { message: "Unauthenticated User!" },
        { status: 401 }
      );
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          courseId: params.courseId,
          userId: user.id,
        },
      },
    });

    if (purchase) {
      return NextResponse.json(
        { message: "Alredy purchase course" },
        { status: 400 }
      );
    }
    if (!course) {
      return NextResponse.json(
        { message: "course not found" },
        { status: 404 }
      );
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course?.title!,
            description: course?.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];
    console.log("hello froml line iteams:");
    console.log(line_items);

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (stripeCustomer === null) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses?.[0]?.emailAddress,
      });

      console.log(customer);

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    console.log("stripe cusotmer:===>");
    console.log(stripeCustomer);

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${params.courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${params.courseId}?canceled=1`,
      metadata: {
        courseId: params.courseId,
        userId: user.id,
      },
    });
    console.log("session url");
    console.log(session);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("checkout error:", error);
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
