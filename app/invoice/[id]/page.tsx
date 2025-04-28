import { notFound } from "next/navigation"
import InvoiceDetails from "@/components/invoice-details"
import { getInvoice } from "@/lib/btcpay"

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = params

  try {
    const invoice = await getInvoice(id)

    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[70vh]">
            <InvoiceDetails invoiceId={id} initialInvoice={invoice} />
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error)
    notFound()
  }
}
