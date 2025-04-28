"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getInvoices } from "@/lib/btcpay-api"
import type { Invoice } from "@/lib/types"

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices()
        setInvoices(data)
      } catch (err) {
        console.error("Error fetching invoices:", err)
        setError("Failed to load invoices. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2">Loading invoices...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-destructive">{error}</CardContent>
      </Card>
    )
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No invoices found. Create your first invoice to get started.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium truncate" title={invoice.description}>
                  {invoice.description || "No description"}
                </div>
                <StatusBadge status={invoice.status} />
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                {formatDistanceToNow(new Date(invoice.createdTime), { addSuffix: true })}
              </div>

              <div className="flex justify-between items-center">
                <div className="font-semibold">
                  {invoice.amount} {invoice.currency}
                </div>
                <Link href={`/invoice/${invoice.id}`} className="flex items-center text-sm text-primary">
                  View details
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" = "outline"

  switch (status.toLowerCase()) {
    case "new":
    case "processing":
      variant = "secondary"
      break
    case "settled":
    case "complete":
    case "paid":
      variant = "success"
      break
    case "expired":
    case "invalid":
      variant = "destructive"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge variant={variant} className="ml-2">
      {status}
    </Badge>
  )
}
