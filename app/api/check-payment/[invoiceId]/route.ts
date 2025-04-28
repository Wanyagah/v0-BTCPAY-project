import { type NextRequest, NextResponse } from "next/server"
import { checkPaymentStatus } from "@/lib/btcpay"

export async function GET(request: NextRequest, { params }: { params: { invoiceId: string } }) {
  try {
    const { invoiceId } = params

    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    const status = await checkPaymentStatus(invoiceId)

    return NextResponse.json(status)
  } catch (error) {
    console.error("Error in check-payment route:", error)
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 })
  }
}
