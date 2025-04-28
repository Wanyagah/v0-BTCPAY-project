import { PaymentForm } from "@/components/payment-form"
import { InvoicesList } from "@/components/invoices-list"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">BTCPay Greenfield API Demo</h1>
        <p className="text-muted-foreground">Create and manage Bitcoin payments using BTCPay Server</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>
          <PaymentForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Invoices</h2>
          <InvoicesList />
        </div>
      </div>
    </main>
  )
}
