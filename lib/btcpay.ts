import { getBTCPayServerInfo } from "./btcpay-helpers"

/**
 * Creates an invoice using the BTCPay Server Greenfield API
 */
export async function createInvoice(amount: number, currency: string, metadata: Record<string, string> = {}) {
  try {
    const { baseUrl, storeId } = getBTCPayServerInfo()

    const response = await fetch(`${baseUrl}/api/v1/stores/${storeId}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${process.env.BTCPAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        metadata,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create invoice: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw error
  }
}

/**
 * Gets an invoice by ID
 */
export async function getInvoice(invoiceId: string) {
  try {
    const { baseUrl, storeId } = getBTCPayServerInfo()

    const response = await fetch(`${baseUrl}/api/v1/stores/${storeId}/invoices/${invoiceId}`, {
      headers: {
        Authorization: `token ${process.env.BTCPAY_API_KEY}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to get invoice: ${response.status} ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting invoice:", error)
    throw error
  }
}

/**
 * Checks the payment status of an invoice
 */
export async function checkPaymentStatus(invoiceId: string) {
  const invoice = await getInvoice(invoiceId)
  return {
    status: invoice.status,
    paid: invoice.status === "Settled" || invoice.status === "Processing",
    expired: invoice.status === "Expired",
    paidAmount: invoice.amount,
    currency: invoice.currency,
  }
}
