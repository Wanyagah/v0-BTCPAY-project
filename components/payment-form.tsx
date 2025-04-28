"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bitcoin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createInvoice } from "@/lib/btcpay-api"
import { toast } from "@/components/ui/use-toast"

export function PaymentForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const invoice = await createInvoice({
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description || "Payment via BTCPay Server",
      })

      toast({
        title: "Invoice created",
        description: "Your invoice has been created successfully",
      })

      // Redirect to the invoice page
      router.push(`/invoice/${invoice.id}`)
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Error creating invoice",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex">
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
                className="rounded-r-none"
              />
              <Button variant="outline" type="button" className="rounded-l-none border-l-0" disabled>
                USD
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Payment description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Invoice...
              </>
            ) : (
              <>
                <Bitcoin className="mr-2 h-4 w-4" />
                Create Bitcoin Invoice
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
