import { NextResponse } from "next/server"
import { getBTCPayServerInfo } from "@/lib/btcpay-helpers"

export async function GET() {
  try {
    const { baseUrl, storeId } = getBTCPayServerInfo()

    if (!baseUrl || !storeId) {
      return NextResponse.json({ error: "BTCPay Server URL is not properly configured" }, { status: 400 })
    }

    if (!process.env.BTCPAY_API_KEY) {
      return NextResponse.json({ error: "BTCPay API key is not configured" }, { status: 400 })
    }

    // Try to fetch store info to verify connection
    const response = await fetch(`${baseUrl}/api/v1/stores/${storeId}`, {
      headers: {
        Authorization: `token ${process.env.BTCPAY_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Failed to connect to BTCPay Server: ${response.status} ${errorText}` },
        { status: 500 },
      )
    }

    const storeInfo = await response.json()

    return NextResponse.json({
      success: true,
      message: "Successfully connected to BTCPay Server",
      store: {
        id: storeInfo.id,
        name: storeInfo.name,
      },
    })
  } catch (error) {
    console.error("Error checking BTCPay connection:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
