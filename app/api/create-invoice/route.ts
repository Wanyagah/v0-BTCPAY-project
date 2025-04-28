import { type NextRequest, NextResponse } from "next/server"
import { createInvoice } from "@/lib/btcpay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, metadata } = body

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 })
    }

    const invoice = await createInvoice(amount, currency, metadata)

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error in create-invoice route:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
