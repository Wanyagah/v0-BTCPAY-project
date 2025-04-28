import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the webhook payload for debugging
    console.log("Received BTCPay webhook:", JSON.stringify(body, null, 2))

    // Extract the invoice data
    const { invoiceId, type } = body

    // Handle different webhook types
    switch (type) {
      case "InvoiceCreated":
        console.log(`Invoice ${invoiceId} created`)
        break
      case "InvoiceReceivedPayment":
        console.log(`Invoice ${invoiceId} received payment`)
        break
      case "InvoiceProcessing":
        console.log(`Invoice ${invoiceId} is processing`)
        break
      case "InvoiceSettled":
        console.log(`Invoice ${invoiceId} has been settled`)
        // Here you would typically update your database or trigger business logic
        break
      case "InvoiceExpired":
        console.log(`Invoice ${invoiceId} has expired`)
        break
      case "InvoiceInvalid":
        console.log(`Invoice ${invoiceId} is invalid`)
        break
      default:
        console.log(`Unhandled webhook type: ${type}`)
    }

    // Return a success response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing BTCPay webhook:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
