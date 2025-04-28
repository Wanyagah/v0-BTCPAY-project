/**
 * Helper functions for working with BTCPay Server
 */

/**
 * Extracts the base URL and store ID from the BTCPay Server URL
 */
export function getBTCPayServerInfo() {
  const serverUrl = process.env.BTCPAY_SERVER_URL || ""

  // Check if the URL contains '/stores/'
  if (serverUrl.includes("/stores/")) {
    const [baseUrl, storeIdPath] = serverUrl.split("/stores/")
    const storeId = storeIdPath.split("/")[0] // In case there are additional path segments

    return {
      baseUrl,
      storeId,
      fullStoreUrl: serverUrl,
    }
  }

  // If the URL doesn't contain '/stores/', assume it's just the base URL
  return {
    baseUrl: serverUrl,
    storeId: "current", // Default to 'current' store
    fullStoreUrl: serverUrl,
  }
}
