"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, Check, XCircle, RefreshCw } from "lucide-react"

interface InvoiceDetailsProps {
  invoiceId: string
  initialInvoice: any
}

export default function InvoiceDetails({ invoiceId, initialInvoice }: InvoiceDetailsProps) {
  const [invoice, setInvoice] = useState(initialInvoice)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkPaymentStatus = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/check-payment/${invoiceId}`)

      if (!response.ok) {
        throw new Error("Failed to check payment status")
      }

      const status = await response.json()
      setInvoice({ ...invoice, ...status })
    } catch (err) {
      console.error("Error checking payment status:", err)
      setError("Failed to update payment status")
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    if (invoice.status !== "Settled" && invoice.status !== "Expired") {
      const interval = setInterval(checkPaymentStatus, 30000)
      return () => clearInterval(interval)
    }
  }, [invoice.status, invoiceId])

  const getStatusBadge = () => {
    switch (invoice.status) {
      case "New":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Awaiting Payment
          </Badge>
        )
      case "Processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        )
      case "Settled":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        )
      case "Expired":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">{invoice.status}</Badge>
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Invoice #{invoice.id?.substring(0, 8)}</span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Created on {new Date(invoice.createdTime).toLocaleString()}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col items-center space-y-4">
          {invoice.status === "Settled" ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="h-40 w-40 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-20 w-20 text-green-500" />
              </div>
              <p className="text-xl font-medium">Payment Received!</p>
            </div>
          ) : invoice.status === "Expired" ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="h-40 w-40 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-20 w-20 text-red-500" />
              </div>
              <p className="text-xl font-medium">Invoice Expired</p>
            </div>
          ) : (
            <>
              {invoice.checkoutLink && (
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src={`${invoice.checkoutLink}/qr`}
                    alt="Bitcoin Payment QR Code"
                    width={200}
                    height={200}
                    className="border p-2 rounded-lg"
                  />
                  <p className="text-sm text-center max-w-xs">
                    Scan this QR code with your Bitcoin wallet or click the button below to pay
                  </p>
                </div>
              )}

              <div className="space-y-2 text-center">
                <p className="text-2xl font-bold">
                  {invoice.amount} {invoice.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  Invoice expires in{" "}
                  {invoice.expirationTime
                    ? new Date(new Date(invoice.expirationTime).getTime() - new Date().getTime()).getMinutes()
                    : "15"}{" "}
                  minutes
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        {invoice.status !== "Settled" && invoice.status !== "Expired" && (
          <>
            {invoice.checkoutLink && (
              <Button className="w-full" variant="default" asChild>
                <Link
                  href={invoice.checkoutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Pay with BTCPay</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button variant="outline" className="w-full" onClick={checkPaymentStatus} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Payment Status
                </>
              )}
            </Button>
          </>
        )}

        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Return to Store</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
