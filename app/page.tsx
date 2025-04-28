import CreateInvoiceForm from "@/components/create-invoice-form"
import BTCPayDebug from "@/components/btcpay-debug"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bitcoin } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Bitcoin Payments with BTCPay Server</h1>
          <p className="text-lg text-muted-foreground">
            Accept Bitcoin payments easily using the BTCPay Server Greenfield API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-orange-500" />
                Why Use BTCPay Server?
              </CardTitle>
              <CardDescription>The self-hosted, open-source Bitcoin payment processor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2">
                <li>No fees, no intermediaries, just Bitcoin</li>
                <li>Full control over your payment processing</li>
                <li>Privacy-focused, no KYC required</li>
                <li>Supports Lightning Network for instant payments</li>
                <li>Powerful API for seamless integration</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <CreateInvoiceForm />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Debug Tools</h2>
          <div className="max-w-md mx-auto">
            <BTCPayDebug />
          </div>
        </div>
      </div>
    </main>
  )
}
