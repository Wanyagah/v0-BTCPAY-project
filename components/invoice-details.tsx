"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Bitcoin, CheckCircle, Clock, Copy, ExternalLink, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import type { Invoice } from "@/lib/types"
import { checkInvoiceStatus } from "@/lib/btcpay-api"

interface InvoiceDetailsProps {
  invoice: Invoice
}

export function InvoiceDetails({ invoice: initialInvoice }: InvoiceDetailsProps) {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice)
  const [isPolling, setIsPolling] = useState(false)

  // Start polling for invoice status updates if the invoice is not settled
  useEffect(() => {
    if (["new", "processing", "unconfirmed"].includes(invoice.status.toLowerCase())) {
      setIsPolling(true)

      const intervalId = setInterval(async () => {
        try {
          const updatedInvoice = await checkInvoiceStatus(invoice.id)
          setInvoice(updatedInvoice)

          // If the invoice is settled or expired, stop polling
          if (["settled", "complete", "paid", "expired", "invalid"].includes(updatedInvoice.status.toLowerCase())) {
            setIsPolling(false)
            clearInterval(intervalId)

            if (["settled", "complete", "paid"].includes(updatedInvoice.status.toLowerCase())) {
              toast({
                title: "Payment received!",
                description: "Your Bitcoin payment has been successfully received.",
                variant: "success",
              })
            }
          }
        } catch (error) {
          console.error("Error checking invoice status:", error)
        }
      }, 5000) // Check every 5 seconds

      return () => clearInterval(intervalId)
    }
  }, [invoice.id, invoice.status])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const getStatusColor = () => {
    const status = invoice.status.toLowerCase()
    if (["settled", "complete", "paid"].includes(status)) return "text-green-500"
    if (["expired", "invalid"].includes(status)) return "text-destructive"
    return "text-amber-500"
  }

  const getStatusIcon = () => {
    const status = invoice.status.toLowerCase()
    if (["settled", "complete", "paid"].includes(status)) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (["expired", "invalid"].includes(status)) return <ExternalLink className="h-5 w-5 text-destructive" />
    return <Clock className="h-5 w-5 text-amber-500" />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Invoice #{invoice.id.substring(0, 8)}</CardTitle>
              <CardDescription>
                Created {formatDistanceToNow(new Date(invoice.createdTime), { addSuffix: true })}
              </CardDescription>
            </div>
            <Badge className={getStatusColor()}>
              <span className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1">{invoice.status}</span>
              </span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p>{invoice.description || "No description provided"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
              <p className="text-xl font-semibold">
                {invoice.amount} {invoice.currency}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Bitcoin Amount</h3>
              <p className="text-xl font-semibold flex items-center">
                <Bitcoin className="h-4 w-4 mr-1" />
                {invoice.btcAmount || "0.00000000"} BTC
              </p>
            </div>
          </div>

          <Separator />

          {invoice.paymentLink && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Payment Details</h3>
                {isPolling && (
                  <Badge variant="outline" className="animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    Waiting for payment...
                  </Badge>
                )}
              </div>

              <div className="flex justify-center mb-4">
                <div className="bg-white p-2 rounded">
                  <QrCode className="h-32 w-32" />
                </div>
              </div>

              {invoice.bitcoinAddress && (
                <div className="mb-2">
                  <h4 className="text-xs text-muted-foreground mb-1">Bitcoin Address</h4>
                  <div className="flex items-center">
                    <code className="bg-background p-2 rounded text-xs flex-1 overflow-x-auto">
                      {invoice.bitcoinAddress}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(invoice.bitcoinAddress!, "Bitcoin address")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => window.open(invoice.paymentLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Wallet
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <p className="text-xs text-muted-foreground">Powered by BTCPay Server Greenfield API</p>
        </CardFooter>
      </Card>
    </div>
  )
}
