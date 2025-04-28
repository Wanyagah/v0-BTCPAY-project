"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function BTCPayDebug() {
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<null | { success: boolean; message: string }>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    setStatus(null)

    try {
      const response = await fetch("/api/check-btcpay-connection")
      const data = await response.json()

      if (response.ok) {
        setStatus({ success: true, message: "Successfully connected to BTCPay Server!" })
      } else {
        setStatus({ success: false, message: data.error || "Failed to connect to BTCPay Server" })
      }
    } catch (error) {
      setStatus({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>BTCPay Server Connection</CardTitle>
        <CardDescription>Check if your BTCPay Server connection is working</CardDescription>
      </CardHeader>
      <CardContent>
        {status && (
          <Alert variant={status.success ? "default" : "destructive"} className="mb-4">
            {status.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{status.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={isChecking} className="w-full">
          {isChecking ? "Checking Connection..." : "Check BTCPay Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
