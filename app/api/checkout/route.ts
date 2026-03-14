import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId, email } = await req.json();

    if (!productId || !email) {
      return NextResponse.json(
        { error: "Missing productId or email" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.POLAR_SERVER === "production"
        ? "https://api.polar.sh/v1"
        : "https://sandbox-api.polar.sh/v1";

    const response = await fetch(`${baseUrl}/checkouts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: [productId],
        success_url: `${process.env.POLAR_SUCCESS_URL}?email=${encodeURIComponent(email)}`,
        customer_email: email,
        metadata: {
          email,
          source: "payproof-signup-gate",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail || data?.error || "Failed to create checkout", data },
        { status: response.status }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
