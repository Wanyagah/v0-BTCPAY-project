import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getInvoice } from "@/lib/btcpay-api"
import { InvoiceDetails } from "@/components/invoice-details"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  try {
    const invoice = await getInvoice(params.id)
    return {
      title: `Invoice #${params.id.substring(0, 8)} - BTCPay Demo`,
      description: invoice.description || "Bitcoin payment invoice",
    }
  } catch (error) {
    return {
      title: "Invoice Not Found - BTCPay Demo",
      description: "The requested invoice could not be found",
    }
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  try {
    const invoice = await getInvoice(params.id)

    return (
      <main className="container mx-auto py-10 px-4">
        <InvoiceDetails invoice={invoice} />
      </main>
    )
  } catch (error) {
    notFound()
  }
}
