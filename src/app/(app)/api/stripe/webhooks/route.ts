import { metadata } from "./../../../layout";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getPayload } from "payload";
import type { Stripe } from "stripe";
import config from "@payload-config";
import { ExpandedLineItem } from "@/modules/checkout/types";
export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown Error");

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown Error" },
      { status: 400 }
    );
  }

  console.log("Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    // "checkout.session.async_payment_succeeded",
    // "checkout.session.async_payment_failed",
  ];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          if (!data.metadata?.userId) throw new Error("No userId in metadata");

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });
          if (!user) throw new Error("No user found");

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            { expand: ["line_items.data.price.product"] }
          );

          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }

          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const lineItem of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                products: lineItem.price.product.metadata.id,
                name: lineItem.price.product.name,
              },
            });
          }
          break;

        default:
          throw new Error(`Invalid event type ${data.type}`);
      }
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        { messsage: "Error processing webhook" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ message: "Success" }, { status: 200 });
}
