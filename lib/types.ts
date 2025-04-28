export interface Invoice {
  id: string
  storeId: string
  amount: number
  currency: string
  status: string
  createdTime: string
  expirationTime: string
  monitoringExpiration: string
  description?: string
  receiptUrl?: string
  checkoutLink?: string
  paymentLink?: string
  bitcoinAddress?: string
  btcAmount?: string
}

export interface CreateInvoiceParams {
  amount: number
  currency: string
  description?: string
}
