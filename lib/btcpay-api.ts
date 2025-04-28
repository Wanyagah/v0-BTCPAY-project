import type { CreateInvoiceParams, Invoice } from "./types"

const BTCPAY_SERVER_URL = process.env.BTCPAY_SERVER_URL
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY

if (!BTCPAY_SERVER_URL) {
  throw new Error("BTCPAY_SERVER_URL environment variable is not set")
}

if (!BTCPAY_API_KEY) {
  throw new Error("BTCPAY_API_KEY environment variable is not set")
}

/**
 * Create a new invoice using BTCPay Server API
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
  const response = await fetch(`${BTCPAY_SERVER_URL}/api/v1/stores/current/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${BTCPAY_API_KEY}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      metadata: {
        description: params.description,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create invoice")
  }

  const data = await response.json()

  // Format the response to match our Invoice type
  return {
    id: data.id,
    storeId: data.storeId,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    createdTime: data.createdTime,
    expirationTime: data.expirationTime,
    monitoringExpiration: data.monitoringExpiration,
    description: data.metadata?.description,
    receiptUrl: data.receiptUrl,
    checkoutLink: data.checkoutLink,
    paymentLink: data.checkoutLink, // Using checkout link as payment link
    bitcoinAddress: data.addresses?.bitcoin, // Bitcoin address if available
    btcAmount: data.cryptoInfo?.[0]?.cryptoCode === "BTC" ? data.cryptoInfo[0].due : undefined,
  }
}

/**
 * Get a specific invoice by ID
 */
export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const response = await fetch(`${BTCPAY_SERVER_URL}/api/v1/stores/current/invoices/${invoiceId}`, {
    headers: {
      Authorization: `token ${BTCPAY_API_KEY}`,
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Invoice not found")
    }
    throw new Error("Failed to fetch invoice")
  }

  const data = await response.json()

  return {
    id: data.id,
    storeId: data.storeId,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    createdTime: data.createdTime,
    expirationTime: data.expirationTime,
    monitoringExpiration: data.monitoringExpiration,
    description: data.metadata?.description,
    receiptUrl: data.receiptUrl,
    checkoutLink: data.checkoutLink,
    paymentLink: data.checkoutLink,
    bitcoinAddress: data.addresses?.bitcoin,
    btcAmount: data.cryptoInfo?.[0]?.cryptoCode === "BTC" ? data.cryptoInfo[0].due : undefined,
  }
}

/**
 * Get a list of invoices
 */
export async function getInvoices(limit = 10): Promise<Invoice[]> {
  const response = await fetch(`${BTCPAY_SERVER_URL}/api/v1/stores/current/invoices?limit=${limit}`, {
    headers: {
      Authorization: `token ${BTCPAY_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch invoices")
  }

  const data = await response.json()

  return data.map((invoice: any) => ({
    id: invoice.id,
    storeId: invoice.storeId,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    createdTime: invoice.createdTime,
    expirationTime: invoice.expirationTime,
    monitoringExpiration: invoice.monitoringExpiration,
    description: invoice.metadata?.description,
    receiptUrl: invoice.receiptUrl,
    checkoutLink: invoice.checkoutLink,
  }))
}

/**
 * Check the status of an invoice
 */
export async function checkInvoiceStatus(invoiceId: string): Promise<Invoice> {
  return getInvoice(invoiceId)
}
