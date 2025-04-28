import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the webhook payload
    console.log("Received BTCPay webhook:", JSON.stringify(body, null, 2))

    // Here you would typically:
    // 1. Verify the webhook signature (if available)
    // 2. Process the event based on type (payment received, confirmed, etc.)
    // 3. Update your database records
    // 4. Trigger any necessary business logic

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error in BTCPay webhook handler:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
