import "./globals.css"
import App from "@/app/components/App"
import FacebookPixel from "@/app/components/FacebookPixel"
import GoogleAnalytics from "@/app/components/GoogleAnalytics"

export const metadata = {
  title: "Stock my Goods | New eCommerce Marketplace for Sellers and Warehouse Service Providers",
  description: "Stock my Goods is a new ecommerce marketplace platform for sellers providing return management, fulfillments by smg, purchase order, inventory tracking, repoting and analysis.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <FacebookPixel />
      </head>
      <body suppressHydrationWarning={true}>
        <GoogleAnalytics />
        <App>{children}</App>
      </body>
    </html>
  )
}
